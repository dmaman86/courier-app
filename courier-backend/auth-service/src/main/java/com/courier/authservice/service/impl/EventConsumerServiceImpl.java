package com.courier.authservice.service.impl;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.courier.authservice.objects.dto.EventPayload;
import com.courier.authservice.objects.dto.UserDto;
import com.courier.authservice.service.EventConsumerService;
import com.courier.authservice.service.UserCredentialService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EventConsumerServiceImpl implements EventConsumerService {

  private static final Logger logger = LoggerFactory.getLogger(EventConsumerServiceImpl.class);

  @Autowired private UserCredentialService userCredentialService;

  @Autowired private ObjectMapper objectMapper;

  @Override
  @KafkaListener(topics = "user-created", groupId = "auth-service-group")
  public void handleUserCreated(ConsumerRecord<String, String> record) {
    try {
      logger.info("Received message - Topic: {}, Value: {}", record.topic(), record.value());
      EventPayload eventPayload = objectMapper.readValue(record.value(), EventPayload.class);
      UserDto userDto = objectMapper.convertValue(eventPayload.getData(), UserDto.class);

      logger.info("Received user-created event for user: {}", userDto.getId());
      userCredentialService.createUserCredential(userDto);
    } catch (JsonProcessingException e) {
      logger.error("Error processing message: {}", e.getMessage());
    }
  }
}
