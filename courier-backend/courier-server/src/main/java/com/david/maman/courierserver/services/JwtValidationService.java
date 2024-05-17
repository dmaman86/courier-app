package com.david.maman.courierserver.services;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Service
public class JwtValidationService {

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationService.class);

    @Autowired
    private JwtService jwtService;


    @KafkaListener(topics = "public-key-topic", groupId = "public-key-group")
    public void receivePublicKey(String publicKeyString) {

        
        try {
            byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyString);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);
            logger.info("Received public key from Kafka: {}", publicKey);
            jwtService.setPublicKey(publicKey);
        } catch (Exception e) {
            throw new RuntimeException("Error initializing public key, ", e);
        }
    }

}
