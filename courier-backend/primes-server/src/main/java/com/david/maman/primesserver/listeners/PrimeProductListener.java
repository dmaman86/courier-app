package com.david.maman.primesserver.listeners;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.david.maman.primesserver.models.dto.PrimeProductDto;
import com.david.maman.primesserver.models.entities.PrimeProduct;
import com.david.maman.primesserver.repositories.PrimeProductRepository;
import com.david.maman.primesserver.services.PrimeProductService;

@Component
public class PrimeProductListener {

    private static final Logger logger = LoggerFactory.getLogger(PrimeProductListener.class);

    @Autowired
    private PrimeProductService primeProductService;

    @Autowired
    private KafkaTemplate<String, PrimeProductDto> kafkaTemplate;

    @Autowired
    private PrimeProductRepository primeProductRepository;

    @KafkaListener(topics = "request-prime-product", groupId = "primes-consumer")
    public void handleRequest(String message){
        logger.info("Received request for new prime product.");

        PrimeProductDto primeProductDto = primeProductService.generatePrimeProduct();
        PrimeProduct primeProduct = PrimeProduct.builder()
                                        .product(Base64.getEncoder().encodeToString(primeProductDto.getProduct().getBytes(StandardCharsets.UTF_8)))
                                        .phiProduct(Base64.getEncoder().encodeToString(primeProductDto.getPhiProduct().getBytes(StandardCharsets.UTF_8)))
                                        .build();

        String messageId = UUID.randomUUID().toString();
        primeProductRepository.save(primeProduct);
        kafkaTemplate.send("response-prime-product", messageId, primeProductDto);
    }

}
