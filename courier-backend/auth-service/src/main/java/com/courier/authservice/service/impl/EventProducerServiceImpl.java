package com.courier.authservice.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.courier.authservice.objects.dto.ErrorLogDto;
import com.courier.authservice.objects.dto.EventPayload;
import com.courier.authservice.objects.enums.EventType;
import com.courier.authservice.service.EventProducerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EventProducerServiceImpl implements EventProducerService {

  private static final Logger logger = LoggerFactory.getLogger(EventProducerServiceImpl.class);

  @Autowired private ObjectMapper objectMapper;

  @Autowired private KafkaTemplate<String, EventPayload> kafkaTemplate;

  private static final String ERROR_TOPIC = "error-topic";

  public <T> void publishEvent(T data, EventType eventType, String topic) {
    try {
      String payloadJson = objectMapper.writeValueAsString(data);
      EventPayload eventPayload =
          EventPayload.builder().eventType(eventType).data(payloadJson).build();

      logger.info("Publishing event to Kafka: {}", eventPayload);
      kafkaTemplate.send(topic, eventPayload);
    } catch (JsonProcessingException ex) {
      throw new RuntimeException("Error while serializing event payload: " + ex.getMessage());
    }
  }

  @Override
  public void sendErrorEvent(ErrorLogDto errorLogDto) {
    logger.info("Sent error log to Kafka: {}", errorLogDto);
    publishEvent(errorLogDto, EventType.ERROR_LOG, ERROR_TOPIC);
  }
}
