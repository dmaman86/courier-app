package com.david.maman.authenticationserver.services;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.entities.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KafkaConsumerListener {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerListener.class);

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "user-topic", groupId = "auth-consumer")
    public void receiveUser(ConsumerRecord<String, String> record){
        try{
            User user = objectMapper.readValue(record.value(), User.class);
            logger.info("Received user: {}", user);
        }catch(JsonProcessingException e){
            logger.error("Error processing message", e);
        }
    }

}
