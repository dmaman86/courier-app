package com.david.maman.primesserver.services;

import java.math.BigInteger;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.david.maman.primesserver.models.dto.PrimeProductDto;


@Service
public class PrimeProductService {

    private static final Logger logger = LoggerFactory.getLogger(PrimeProductService.class);

    private static final Random rand = new Random();

    public PrimeProductDto generatePrimeProduct(){
        BigInteger p = generatePrime(2048, 10);
        BigInteger q;

        do{
            q = generatePrime(2048, 10);
        }while(q.equals(p));

        return createPrimeProductDto(p, q);
    }

    private static BigInteger generatePrime(int bitLenght, int certainty){
        BigInteger prime;
        do{
            prime = new BigInteger(bitLenght, rand);
        }while(!isPrime(prime, certainty));
        return prime;
    }

    private static boolean isPrime(BigInteger n, int k){
        if(n.compareTo(BigInteger.TWO) < 0) return false;
        if(n.compareTo(BigInteger.TWO) == 0 || n.compareTo(BigInteger.valueOf(3)) == 0) return true;
        if(n.mod(BigInteger.TWO).equals(BigInteger.ZERO)) return false;

        BigInteger r = n.subtract(BigInteger.ONE);
        int s = 0;

        while(r.mod(BigInteger.TWO).equals(BigInteger.ZERO)){
            r = r.divide(BigInteger.TWO);
            s++;
        }

        for (int i = 0; i < k; i++) {
            BigInteger a = uniformRandom(BigInteger.TWO, n.subtract(BigInteger.TWO));
            BigInteger x = a.modPow(r, n);

            if (x.equals(BigInteger.ONE) || x.equals(n.subtract(BigInteger.ONE))) continue;

            int j = 0;
            for (; j < s - 1; j++) {
                x = x.modPow(BigInteger.TWO, n);
                if (x.equals(BigInteger.ONE)) return false;
                if (x.equals(n.subtract(BigInteger.ONE))) break;
            }

            if (j == s - 1) return false;
        }
        return true;
    }

    private static BigInteger uniformRandom(BigInteger min, BigInteger max){
        BigInteger bigInteger = max.subtract(min);
        int len = max.bitLength();
        BigInteger res = new BigInteger(len, rand);

        if(res.compareTo(min) < 0) res = res.add(min);
        if(res.compareTo(bigInteger) >= 0) res = res.mod(bigInteger).add(min);

        return res;
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
