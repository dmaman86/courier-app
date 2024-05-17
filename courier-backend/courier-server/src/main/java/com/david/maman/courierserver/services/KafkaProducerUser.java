package com.david.maman.courierserver.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.entities.User;

@Service
public class KafkaProducerUser {

    @Autowired
    private KafkaTemplate<String, User> kafkaTemplate;

    public void sendUser(User user){
        String messageId = UUID.randomUUID().toString();
        kafkaTemplate.send("user-topic", messageId, user);
    }

}
