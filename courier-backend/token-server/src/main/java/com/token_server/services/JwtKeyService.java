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


/*@Service
public class JwtKeyService {


    private static final Logger logger = LoggerFactory.getLogger(JwtKeyService.class);
    @Autowired
    private PrimeProductService primeProductService;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private CompletableFuture<Void> keyGenerationFuture = new CompletableFuture<>();

    @EventListener(ApplicationReadyEvent.class)
    public void init(){
        if(!jwtService.isKeyPairSet()){
            generateKeys();
        } else {
            keyGenerationFuture.complete(null);
        }
    }

    private void generateKeys(){
        CompletableFuture.supplyAsync(() -> primeProductService.generatePrimeProduct())
                .thenAccept(primeProduct -> {
                    logger.info("Prime product generated: {}", primeProduct);

                    BigInteger n = new BigInteger(primeProduct.getProduct());
                    BigInteger phi = new BigInteger(primeProduct.getPhiProduct());
                    BigInteger e = findOptimalCoprime(phi);

                    jwtService.setKeyPair(initializeKeys(n, e));

                    notifyKeyGenerationComplete();
                    
                    keyGenerationFuture.complete(null);
                })
                .exceptionally(throwable -> {
                    logger.error("Error generating prime product", throwable);
                    keyGenerationFuture.completeExceptionally(throwable);
                    return null;
                });
    }


    public CompletableFuture<Void> waitForKeyGeneration(){
        return keyGenerationFuture;
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
}*/
