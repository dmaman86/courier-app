package com.david.maman.authenticationserver.models.dto;

import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.RSAKeyGenParameterSpec;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RSAKeyManager {

    private static final Logger logger = LoggerFactory.getLogger(RSAKeyManager.class);
    private KeyPair keyPair;


    public RSAKeyManager(BigInteger n, BigInteger phi){
        BigInteger e = findOptimalCoprime(phi);
        BigInteger d = e.modInverse(phi);

        logger.info("d: {}", d);

        initializeKeys(n, e);
    }

    public KeyPair getKeyPair(){
        return this.keyPair;
    }

    public PublicKey getPublicKey(){
        return this.keyPair.getPublic();
    }

    public PrivateKey getPrivateKey(){
        return this.keyPair.getPrivate();
    }

    public String getPublicKeyAsBase64() {
        return Base64.getEncoder().encodeToString(getPublicKey().getEncoded());
    }

    public String getPrivateKeyAsBase64() {
        return Base64.getEncoder().encodeToString(getPrivateKey().getEncoded());
    }

    @Override
    public String toString() {
        return "RSAKeyManager [publicKey=" + getPublicKey() + ", privateKey=" + getPrivateKey() 
               + ", getPublicKeyAsBase64()=" + getPublicKeyAsBase64() + ", getPrivateKeyAsBase64()=" 
               + getPrivateKeyAsBase64() + "]";
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

    private void initializeKeys(BigInteger n, BigInteger e){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(new RSAKeyGenParameterSpec(n.bitLength(), e));
            this.keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception exception) {
            throw new RuntimeException("Error initializing RSA keys", exception);
        }
    }
}
