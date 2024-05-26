package com.david.maman.courierserver.services;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
public class JwtValidationService {

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationService.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private KafkaListenerEndpointRegistry registry;

    @Autowired
    private JwtService jwtService;

    private CompletableFuture<String> futurePublicKey;


    @EventListener(ApplicationReadyEvent.class)
    public void startRequestingOnStartup(){
        requestPublicKey();
    }

    public void requestPublicKey(){
        futurePublicKey = new CompletableFuture<>();
        kafkaTemplate.send("request-public-key", "Request for public key");
        try{
            String publicKeyString = futurePublicKey.get();
            processPublicKey(publicKeyString);
        }catch(InterruptedException | ExecutionException e){
            logger.error("Error processing message", e);
        }
    }


    @KafkaListener(id = "publicKeyConsumerId", topics = "public-key-topic", groupId = "public-key-group")
    public void receivePublicKey(String publicKeyString) {
        if(publicKeyString == null || publicKeyString.isEmpty()){
            logger.error("Received empty public key");
            return;
        }
        futurePublicKey.complete(publicKeyString);
        registry.getListenerContainer("publicKeyConsumerId").pause();
    }

    private void processPublicKey(String publicKeyString){
        try {
            byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyString);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);
            logger.info("Received public key from Kafka: {}", publicKey);
            jwtService.setPublicKey(publicKey);
            resumeKafkaListener();
        } catch (Exception e) {
            throw new RuntimeException("Error initializing public key, ", e);
        }
    }

    public void resumeKafkaListener(){
        registry.getListenerContainer("publicKeyConsumerId").resume();
    }

    @KafkaListener(id = "authServerHealthCheckConsumerId", topics = "auth-server-health-check", groupId = "public-key-group")
    public void handleAuthServerHealthCheck(String message){
        if("auth-server-restarted".equals(message)){
            logger.info("Detected authentication-server restart, requesting public key again");
            jwtService.setPublicKeyFlag(false);
            resumeKafkaListener();
            requestPublicKey();
        }
    }

}
