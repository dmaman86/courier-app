package com.david.maman.courierserver.services;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.dto.PublicKeyRequest;
import com.david.maman.courierserver.models.dto.PublicKeyResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class JwtValidationService {

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationService.class);

    // @Autowired
    // private KafkaTemplate<String, String> kafkaTemplate;
    @Autowired
    private KafkaTemplate<String, PublicKeyRequest> kafkaTemplate;

    @Autowired
    private KafkaListenerEndpointRegistry registry;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private CompletableFuture<PublicKeyResponse> futurePublicKey;


    /*@EventListener(ApplicationReadyEvent.class)
    public void startRequestingOnStartup(){
        requestPublicKey();
    }*/

    public void requestPublicKey(){
        futurePublicKey = new CompletableFuture<>();

        String correlationId = UUID.randomUUID().toString();
        PublicKeyRequest request = PublicKeyRequest.builder()
                                                .correlationId(correlationId)
                                                .serverName("courier-server")
                                                .build();

        kafkaTemplate.send("public-key-request", request);

        try{
            PublicKeyResponse response = futurePublicKey.get();
            PublicKey publicKey = convertBase64ToPublicKey(response.getPublicKey());
            processPublicKey(publicKey);
        }catch(InterruptedException | ExecutionException e){
            logger.error("Error requesting public key, ", e);
        } catch (Exception e) {
            logger.error("Error processing public key, ", e);
        }
    }


    @KafkaListener(id = "publicKeyConsumerId", topics = "public-key-response", groupId = "public-key-consumer")
    public void receivePublicKey(ConsumerRecord<String, String> record) {

        try{
            PublicKeyResponse response = objectMapper.readValue(record.value(), PublicKeyResponse.class);
            logger.info("Received public key response: {}", response);
            if(response == null || response.getPublicKey() == null){
                logger.error("Received empty public key response");
                return;
            }
            futurePublicKey.complete(response);
            registry.getListenerContainer("publicKeyConsumerId").pause();
        }catch(JsonProcessingException e){
            logger.error("Error parsing public key response, ", e);
        }
    }

    private PublicKey convertBase64ToPublicKey(String base64PublicKey) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(spec);
    }

    private void processPublicKey(PublicKey publicKey){
        try{
            logger.info("Received public key response: {}", publicKey);
            jwtService.setPublicKey(publicKey);
            resumeKafkaListener();
        }catch(Exception e){
            throw new RuntimeException("Error processing public key, ", e);
        }
    }

    public void resumeKafkaListener(){
        registry.getListenerContainer("publicKeyConsumerId").resume();
    }

    @KafkaListener(topics = "token-server-health", groupId = "public-key-group")
    public void handleAuthServerHealthCheck(String message){
        logger.info("Raw message received: [{}]", message);
    
        String cleanedMessage = message.replace("\"", "").trim();

        if ("token-server-restarted".equals(cleanedMessage)) {
            logger.info("Detected token-server restart, invalidating public key");
            jwtService.setPublicKeyFlag(false);
        } else if ("keys-generated".equals(cleanedMessage)) {
            logger.info("Detected key generation completed, requesting public key");
            requestPublicKey();
        }
    }

}
