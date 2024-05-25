package com.david.maman.authenticationserver.services;

import java.math.BigInteger;

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

import com.david.maman.authenticationserver.models.dto.PrimeProductDto;
import com.david.maman.authenticationserver.models.dto.RSAKeyManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JwtKeyService {

    private static final Logger logger = LoggerFactory.getLogger(JwtKeyService.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private KafkaListenerEndpointRegistry registry;

    private CompletableFuture<PrimeProductDto> futureProduct;

    @Autowired
    private JwtService jwtService;

    private String publicKeyString;

    private boolean publicKeyRequestPending = false;

    @EventListener(ApplicationReadyEvent.class)
    public void startRequestingOnStartup(){
        requestData();
    }

    public void requestData(){
        futureProduct = new CompletableFuture<>();
        kafkaTemplate.send("request-prime-product", "Request for prime product");
        try{
            PrimeProductDto primeProductDto = futureProduct.get();
            processProduct(primeProductDto);
        }catch(InterruptedException | ExecutionException e){
            logger.error("Error processing message", e);
        }
    }

    @KafkaListener(id = "consumerId", topics = "response-prime-product", groupId = "auth-primes-consumer")
    public void receiveData(ConsumerRecord<String, String> record){
        try{
            String messageKey = record.key();
            String jsonPayLoad = record.value();

            PrimeProductDto primeProductDto = objectMapper.readValue(jsonPayLoad, PrimeProductDto.class);
            logger.info("Received message with key: {} and value: {}", messageKey, primeProductDto);

            futureProduct.complete(primeProductDto);
            registry.getListenerContainer("consumerId").pause();
            
        }catch(JsonProcessingException e){
            logger.error("Error processing message", e);
        }
    }


    private void processProduct(PrimeProductDto primeProductDto){
        logger.info("Processing prime product: {}", primeProductDto);

        BigInteger n = new BigInteger(primeProductDto.getProduct());
        BigInteger phi = new BigInteger(primeProductDto.getPhiProduct());
        // RSAKeyGenerator rsaKeyGenerator = new RSAKeyGenerator(n, phi);

        RSAKeyManager rsaKeyManager = new RSAKeyManager(n, phi);
        logger.info("Generated RSA keys: {}", rsaKeyManager);

        publicKeyString = rsaKeyManager.getPublicKeyAsBase64();
        // kafkaTemplate.send("public-key-topic", publicKeyString);

        if(publicKeyRequestPending){
            sendPublicKey();
            publicKeyRequestPending = false;
        }

        jwtService.setKeyPair(rsaKeyManager.getKeyPair());
        resumekafkaListener();

        /*if(registry.getListenerContainer("publicKeyRequestConsumerId").isContainerPaused())
            registry.getListenerContainer("publicKeyRequestConsumerId").resume();*/
    }

    @KafkaListener(id = "publicKeyRequestConsumerId", topics = "request-public-key", groupId = "auth-primes-consumer")
    public void handlePublicKeyRequest(String message){
        logger.info("Received public key request: {}", message);
        if(publicKeyString != null){
            sendPublicKey();
        }else{
            logger.info("Public key not yet avaible, marking request as pending");
            publicKeyRequestPending = true;
        }
    }

    private void sendPublicKey(){
        kafkaTemplate.send("public-key-topic", publicKeyString);
        logger.info("Sent public key to Kafka topic: public-key-topic");
    }

    public void resumekafkaListener(){
        registry.getListenerContainer("consumerId").resume();
    }

}
