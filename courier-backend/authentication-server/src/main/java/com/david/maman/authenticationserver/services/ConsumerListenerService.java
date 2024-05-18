package com.david.maman.authenticationserver.services;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.entities.Role;
import com.david.maman.authenticationserver.models.entities.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ConsumerListenerService {

    private static final Logger logger = LoggerFactory.getLogger(ConsumerListenerService.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserCredentialsService userCredentialsService;

    @Autowired
    private RoleService roleService;


    @KafkaListener(topics = "user-topic", groupId = "auth-consumer")
    public void receiveUser(ConsumerRecord<String, String> record){
        try{
            User user = objectMapper.readValue(record.value(), User.class);
            logger.info("Received user: {}", user);
            userCredentialsService.createCredentials(user);
        }catch(JsonProcessingException e){
            logger.error("Error processing message", e);
        }
    }

    @KafkaListener(topics = "role-topic", groupId = "auth-consumer")
    public void receiveRole(ConsumerRecord<String, String> record){
        try{
            Role role = objectMapper.readValue(record.value(), Role.class);
            logger.info("Received role: {}", role);
            roleService.saveRole(role);
        }catch(JsonProcessingException e){
            logger.error("Error processing message", e);
        }
    }

    @KafkaListener(topics = "delete-role-topic", groupId = "auth-consumer")
    public void receiveDeleteRole(ConsumerRecord<String, String> record){
        try{
            Role role = objectMapper.readValue(record.value(), Role.class);
            logger.info("Received role: {}", role);
            roleService.deleteRole(role);
        }catch(JsonProcessingException e){
            logger.error("Error processing message", e);
        }
    }

}
