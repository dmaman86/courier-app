package com.token_server.listeners;

import java.security.PublicKey;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.token_server.models.PublicKeyRequest;
import com.token_server.models.PublicKeyResponse;
import com.token_server.models.TokenRequest;
import com.token_server.models.TokenResponse;
import com.token_server.services.JwtService;

@Service
public class TokenListener {

    private static final Logger logger = LoggerFactory.getLogger(TokenListener.class);

    @Autowired
    private KafkaTemplate<String, PublicKeyResponse> kafkaPublicKey;

    // @Autowired
    // private KafkaTemplate<String, TokenResponse> kafkaToken;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "public-key-request", groupId = "token-key-group")
    public void handlePublicKeyRequest(ConsumerRecord<String, String> record){

        try{
            PublicKeyRequest request = objectMapper.readValue(record.value(), PublicKeyRequest.class);
            logger.info("Received public key request from {}", request.getServerName());

            PublicKey publicKey = jwtService.getPublicKey();
            if(publicKey == null){
                logger.error("Public key not set yet");
                return;
            }
            String publicKeyBase64 = convertPublicKeyToBase64(jwtService.getPublicKey());
            PublicKeyResponse response = PublicKeyResponse.builder()
                                            .correlationId(request.getCorrelationId())
                                            .publicKey(publicKeyBase64)
                                            .build();

            kafkaPublicKey.send("public-key-response", response);
        }catch (JsonProcessingException e) {
            logger.error("Error deserializing message: Invalid JSON format", e);
        } catch (Exception e) {
            logger.error("General error occurred while processing the public key request", e);
        }   
    }

    private String convertPublicKeyToBase64(PublicKey publicKey){
        return java.util.Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }


    /*@KafkaListener(topics = "public-key-request", groupId = "token-key-group")
    public void handlePublicKeyRequest(PublicKeyRequest request){
        logger.info("Received public key request from {}", request.getServerName());
        PublicKeyResponse response = PublicKeyResponse.builder()
                                            .correlationId(request.getCorrelationId())
                                            .publicKey(jwtService.getPublicKey())
                                            .build();

        kafkaPublicKey.send("public-key-response", response);
    }*/

    /*@KafkaListener(topics = "token-requests", groupId = "token-server-group")
    public void handleTokenRequest(TokenRequest request){
        if(jwtService.isKeyPairSet()){
            String token = jwtService.buildToken(request.getUser(), request.getExpiresIn());
            TokenResponse response = TokenResponse.builder()
                                        .correlationId(request.getCorrelationId())
                                        .token(token)
                                        .build();

            kafkaToken.send(request.getReplyTo(), response);
        } else {
            logger.error("Keys not generated yet, cannot respond with token");
        }
    }*/
}
