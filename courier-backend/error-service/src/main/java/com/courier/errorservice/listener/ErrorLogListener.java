package com.courier.errorservice.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.courier.errorservice.objects.dto.ErrorLogDto;
import com.courier.errorservice.objects.dto.EventPayload;
import com.courier.errorservice.objects.entity.ErrorLog;
import com.courier.errorservice.objects.mappers.ErrorLogMapper;
import com.courier.errorservice.repository.ErrorLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ErrorLogListener {

  private static final Logger logger = LoggerFactory.getLogger(ErrorLogListener.class);

  @Autowired private ErrorLogRepository errorLogRepository;

  @Autowired private ErrorLogMapper errorLogMapper;

  @Autowired private ObjectMapper objectMapper;

  @KafkaListener(topics = "error-topic", groupId = "error-service-group")
  public void listen(String message) {
    try {
      EventPayload eventPayload = objectMapper.readValue(message, EventPayload.class);
      ErrorLogDto errorLogDto = objectMapper.readValue(eventPayload.getData(), ErrorLogDto.class);

      logger.info("Received ErrorLog event: {}", errorLogDto);

      ErrorLog errorLog = errorLogMapper.toEntity(errorLogDto);
      errorLogRepository.save(errorLog);

    } catch (JsonProcessingException e) {
      logger.error(
          "Failed to process ErrorLog event. Message: {} | Error: {}", message, e.getMessage());
    }
  }
}
