package com.david.maman.authenticationserver.models.dto;

import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.RSAKeyGenParameterSpec;
import java.util.Base64;

public class RSAKeyManager {

    private KeyPair keyPair;


    public RSAKeyManager(BigInteger n, BigInteger phi){
        BigInteger e = findCoprime(phi);
        BigInteger d = e.modInverse(phi);

        System.out.println("d: " + d);

        initializeKeys(n, e, d);
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

    private BigInteger findCoprime(BigInteger phi){
        BigInteger e = BigInteger.valueOf(2);

        while(e.compareTo(phi) < 0){
            if(e.gcd(phi).equals(BigInteger.ONE)){
                return e;
            }
            e = e.add(BigInteger.ONE);
        }
        return BigInteger.valueOf(65537); // Fallback value
    }

    private void initializeKeys(BigInteger n, BigInteger e, BigInteger d){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(new RSAKeyGenParameterSpec(n.bitLength(), e));
            this.keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception exception) {
            throw new RuntimeException("Error initializing RSA keys", exception);
        }
    }
}
