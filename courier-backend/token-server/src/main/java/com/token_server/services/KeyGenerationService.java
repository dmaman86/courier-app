package com.token_server.services;

import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.security.spec.RSAKeyGenParameterSpec;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.token_server.models.entities.PrimeProduct;

@Service
public class KeyGenerationService {

    private static final Logger logger = LoggerFactory.getLogger(KeyGenerationService.class);
    @Autowired
    private PrimeProductService primeProductService;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void init(){
        initializeKeyGeneration();
    }


    public void initializeKeyGeneration(){
        CompletableFuture.runAsync(() -> {
            primeProductService.generatePrimeProduct();

            PrimeProduct primeProduct = primeProductService.getPrimeProduct();

            BigInteger n = new BigInteger(primeProduct.getProduct());
            BigInteger phi = new BigInteger(primeProduct.getPhiProduct());

            BigInteger e = findOptimalCoprime(phi);

            KeyPair keyPair = initializeKeys(n, e);
            jwtService.setKeyPair(keyPair);
            notifyKeyGenerationComplete();
        })
        .thenAccept((result) -> {
            logger.info("Key generation complete and services have been notified.");
        })
        .exceptionally(ex -> {
            logger.error("Error generating keys", ex);
            return null;
        });
    }

    private void notifyKeyGenerationComplete() {
        kafkaTemplate.send("token-server-health", "keys-generated");
        logger.info("Keys generated, sent notification to other servers");
    }

    private BigInteger findOptimalCoprime(BigInteger phi){
        // phi = 2^r * k
        int r = phi.getLowestSetBit();  // Find the lowest set bit 2^r
        BigInteger k = phi.divide(BigInteger.TWO.pow(r)); // Find k = phi / 2^r

        return findOptionalE(k);
    }

    private BigInteger findOptionalE(BigInteger k){
        SecureRandom random = new SecureRandom();
        BigInteger e = BigInteger.valueOf(65537);

        while(!e.gcd(k).equals(BigInteger.ONE)){
            int bitLength = 17 + random.nextInt(16);
            e = new BigInteger(bitLength, random);

            if(!e.testBit(0)) e = e.add(BigInteger.ONE);
        }
        logger.info("e: {}", e);
        return e;
    }

    private KeyPair initializeKeys(BigInteger n, BigInteger e){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(new RSAKeyGenParameterSpec(n.bitLength(), e));
            return keyPairGenerator.generateKeyPair();
        } catch (Exception exception) {
            throw new RuntimeException("Error initializing RSA keys", exception);
        }
    }

}
