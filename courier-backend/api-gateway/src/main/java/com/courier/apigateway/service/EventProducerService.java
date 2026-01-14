package com.courier.apigateway.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.courier.apigateway.objects.dto.ErrorLogDto;
import com.courier.apigateway.objects.dto.EventPayload;
import com.courier.apigateway.objects.enums.EventType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EventProducerService {

  private static final Logger logger = LoggerFactory.getLogger(EventProducerService.class);

  @Autowired private ObjectMapper objectMapper;
  @Autowired private KafkaTemplate<String, EventPayload> kafkaTemplate;

  private static final String ERROR_TOPIC = "error-topic";

  public <T> void publishEvent(T data, EventType eventType, String topic) {
    try {
      String payloadJson = objectMapper.writeValueAsString(data);
      EventPayload eventPayload =
          EventPayload.builder().eventType(eventType).data(payloadJson).build();

      logger.info("Publishing event to Kafka: {}", eventPayload);
      kafkaTemplate
          .send(topic, eventPayload)
          .whenComplete(
              (result, ex) -> {
                if (ex != null) {
                  logger.error(
                      "Failed to send message to kafka topic {}: {}", topic, ex.getMessage());
                } else {
                  logger.info("Message sent to topic {}: {}", topic, eventPayload);
                }
              });
    } catch (JsonProcessingException ex) {
      throw new RuntimeException("Error while serializing event payload: " + ex.getMessage());
    }
  }

  public void publishErrorLog(ErrorLogDto errorLogDto) {
    publishEvent(errorLogDto, EventType.ERROR_LOG, ERROR_TOPIC);
  }
}
