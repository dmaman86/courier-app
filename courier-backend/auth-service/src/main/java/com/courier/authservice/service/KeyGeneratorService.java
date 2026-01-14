package com.courier.authservice.service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class KeyGeneratorService {

  private static final Logger logger = LoggerFactory.getLogger(KeyGeneratorService.class);

  @Autowired private RedisKeyService redisKeyService;

  @EventListener(ApplicationReadyEvent.class)
  public void init() {
    logger.info("Initializing key generator service");
    redisKeyService.resetKeys();
    generateKeys();
  }

  @Scheduled(cron = "0 0 0 1 */2 ?") // Every 2 months
  public void rotateKeys() {
    logger.info("Executing key rotation");
    generateKeys();
  }

  private void generateKeys() {

    CompletableFuture.runAsync(
            () -> {
              logger.info("Generating keys");

              KeyPair keyPair;
              String publicKey, privateKey;
              boolean keysGenerated = false;

              while (!keysGenerated) {
                keyPair = generateKeyPair();
                publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
                privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());

                if (redisKeyService.getPrivateKey(publicKey) == null) {
                  keysGenerated = true;
                  String authServiceSecret = UUID.randomUUID().toString();
                  redisKeyService.setKeys(privateKey, publicKey, authServiceSecret);
                  logger.info("New key pair generated and saved to Redis");
                }
              }
            })
        .thenRun(() -> logger.info("Key generation process completed successfully"))
        .exceptionally(
            ex -> {
              logger.error("Key generation failed: {}", ex.getMessage(), ex);
              return null;
            });
  }

  private KeyPair generateKeyPair() {
    try {
      KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
      keyPairGenerator.initialize(2048);
      return keyPairGenerator.generateKeyPair();
    } catch (Exception e) {
      throw new RuntimeException("Error generating key pair", e);
    }
  }
}
