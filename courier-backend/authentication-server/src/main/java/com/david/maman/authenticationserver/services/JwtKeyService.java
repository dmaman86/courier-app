package com.david.maman.authenticationserver.services;

import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PublicKey;
import java.security.spec.RSAKeyGenParameterSpec;
import java.util.Base64;
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

import io.jsonwebtoken.Jwts;

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

        String publicKeyString = rsaKeyManager.getPublicKeyAsBase64();
        kafkaTemplate.send("public-key-topic", publicKeyString);

        jwtService.setKeyPair(rsaKeyManager.getKeyPair());
    }


    private BigInteger findCoprime(BigInteger phi){
        BigInteger e = BigInteger.valueOf(2);
        Boolean find_coprime = false;

        while(e.compareTo(phi) < 0 && !find_coprime){
            if(e.gcd(phi).equals(BigInteger.ONE)){
                find_coprime = true;
            }
            e = e.add(BigInteger.ONE);
        }
        return e;
    }

    private KeyPair initializeKeys(BigInteger n, BigInteger e, BigInteger d){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(new RSAKeyGenParameterSpec(n.bitLength(), e));
            return keyPairGenerator.generateKeyPair();
        } catch (Exception exception) {
            throw new RuntimeException("Error initializing RSA keys", exception);
        }
    }

    public String getPublicKeyAsBase64(KeyPair keyPair) {
        return Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
    }

}
