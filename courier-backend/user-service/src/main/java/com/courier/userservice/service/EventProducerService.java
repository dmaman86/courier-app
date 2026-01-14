package com.courier.userservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.courier.userservice.objects.dto.ErrorLogDto;
import com.courier.userservice.objects.dto.EventPayload;
import com.courier.userservice.objects.dto.UserDto;
import com.courier.userservice.objects.enums.EventType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EventProducerService {

  private static final Logger logger = LoggerFactory.getLogger(EventProducerService.class);

  @Autowired private ObjectMapper objectMapper;

  @Autowired private KafkaTemplate<String, EventPayload> eventTemplate;

  public <T> void publishEvent(T data, EventType eventType, String topic) {
    try {
      String payloadJson = objectMapper.writeValueAsString(data);
      EventPayload eventPayload =
          EventPayload.builder().eventType(eventType).data(payloadJson).build();

      logger.info("Publishing event to Kafka: {}", eventPayload);
      eventTemplate
          .send(topic, eventPayload)
          .whenComplete(
              (result, ex) -> {
                if (ex != null) {
                  logger.error(
                      "Failed to send message to Kafka topic {} : {}", topic, ex.getMessage());
                } else {
                  logger.info("Message sent to Kafka topic {} : {}", topic, eventPayload);
                }
              });
    } catch (JsonProcessingException ex) {
      logger.error("Error while converting object to JSON: {}", ex.getMessage());
    }
  }

  public void sendErrorLog(ErrorLogDto errorLogDto) {
    publishEvent(errorLogDto, EventType.ERROR_LOG, "error-topic");
  }

  public void sendUserCreated(UserDto userDto) {
    publishEvent(userDto, EventType.USER_CREATED, "user-created");
  }

  // public void sendUserDeleted(Long userId) {
  //   publishEvent(userId, EventType.USER_DISABLED, "user-disabled");
  // }
}
