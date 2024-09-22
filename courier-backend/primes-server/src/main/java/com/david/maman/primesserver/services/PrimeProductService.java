package com.david.maman.primesserver.services;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.primesserver.models.dto.PrimeProductDto;


@Service
public class PrimeProductService {

    private static final Logger logger = LoggerFactory.getLogger(PrimeProductService.class);
    private static final int BIT_LENGTH = 2048;
    private static final int CERTAINTY = 10;
    private static final SecureRandom rand = new SecureRandom();

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public PrimeProductDto generatePrimeProduct(){
        ExecutorService executor = Executors.newFixedThreadPool(2);
        BigInteger p = null, q = null;

        try{
            Future<BigInteger> futureP = executor.submit(generatePrimeTask());
            Future<BigInteger> futureQ = executor.submit(generatePrimeTask());

            do{
                p = futureP.get();
                q = futureQ.get();

                if(p.equals(q) || isProductInRedis(p, q)){
                    logger.info("p == 1 or product already exists in Redis. Generating new prime numbers");

                    futureP = executor.submit(generatePrimeTask());
                    futureQ = executor.submit(generatePrimeTask());
                }
            }while(p.equals(q) || isProductInRedis(p, q));
            executor.shutdown();
        }catch(Exception e){
            logger.error("Error while generating prime product", e);
            executor.shutdownNow();
        }
        saveProductInRedis(p, q);
        return createPrimeProductDto(p, q);
    }

    private Callable<BigInteger> generatePrimeTask(){
        return () -> {
            BigInteger prime = new BigInteger(BIT_LENGTH, rand);
            while(!isProbablyPrimeRabinMiller(prime)){
                prime = new BigInteger(BIT_LENGTH, rand);
            }
            return prime;
        };
    }

    private static boolean isProbablyPrimeRabinMiller(BigInteger n){
        if(n.compareTo(BigInteger.TWO) < 0) return false;
        if(n.compareTo(BigInteger.TWO) == 0 || n.compareTo(BigInteger.valueOf(3)) == 0) return true;
        if(n.mod(BigInteger.TWO).equals(BigInteger.ZERO)) return false;

        // decompose n-1 to r * 2^s
        BigInteger[] sr = decompose(n.subtract(BigInteger.ONE));
        BigInteger r = sr[0];
        int s = sr[1].intValue();

        for(int i = 0; i < CERTAINTY; i++){
            BigInteger a = generateRandomBase(n);
            if(!testComposite(n, a, r, s)) return false;
        }
        return true;
    }

    // decompose n-1 to r * 2^s
    private static BigInteger[] decompose(BigInteger nMinusOne){
        BigInteger r = nMinusOne;
        int s = 0;

        // convert n-1 to r * 2^s
        while(r.mod(BigInteger.TWO).equals(BigInteger.ZERO)){
            r = r.divide(BigInteger.TWO);
            s++;
        }
        return new BigInteger[]{r, BigInteger.valueOf(s)};
    }

    private static boolean testComposite(BigInteger n, BigInteger a, BigInteger r, int s){
        BigInteger x = a.modPow(r, n); // x = a^r mod n

        // if x == 1 or x == n-1, then n is probably prime
        if(x.equals(BigInteger.ONE) || x.equals(n.subtract(BigInteger.ONE))) return true;

        for(int j = 0; j < s - 1; j++){
            x = x.modPow(BigInteger.TWO, n);    // x = x^2 mod n

            if(x.equals(BigInteger.ONE)) return false; // x is composite
            if(x.equals(n.subtract(BigInteger.ONE))) return true; // x is probably prime
        }
        return false;   // n is composite
    }

    /*private static BigInteger uniformRandom(BigInteger min, BigInteger max){
        BigInteger bigInteger = max.subtract(min);
        int len = max.bitLength();
        BigInteger res = new BigInteger(len, rand);

        if(res.compareTo(min) < 0) res = res.add(min);
        if(res.compareTo(bigInteger) >= 0) res = res.mod(bigInteger).add(min);

        return res;
    }*/

    // generate a random number in the range [2, n-2]
    private static BigInteger generateRandomBase(BigInteger n){
        return uniformRandom(BigInteger.TWO, n.subtract(BigInteger.TWO));
    }

    private static BigInteger uniformRandom(BigInteger min, BigInteger max){
        BigInteger range = max.subtract(min).add(BigInteger.ONE);
        BigInteger randomNum;
        do{
            randomNum = new BigInteger(range.bitLength(), rand);
        }while(randomNum.compareTo(range) >= 0);
        return randomNum.add(min);
    }

    private boolean isProductInRedis(BigInteger p, BigInteger q){
        BigInteger product = p.multiply(q);
        String productKey = "prime_product:" + product.toString();
        return redisTemplate.hasKey(productKey);
    }

    private void saveProductInRedis(BigInteger p, BigInteger q){
        BigInteger product = p.multiply(q);
        String productKey = "prime_product:" + product.toString();
        redisTemplate.opsForValue().set(productKey, "true");
        logger.info("Product {} saved in Redis", product);
    }


    private PrimeProductDto createPrimeProductDto(BigInteger p, BigInteger q) {
        BigInteger n = p.multiply(q);
        BigInteger phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));
        return PrimeProductDto.builder()
                .product(n.toString())
                .phiProduct(phi.toString())
                .build();
    }

}
