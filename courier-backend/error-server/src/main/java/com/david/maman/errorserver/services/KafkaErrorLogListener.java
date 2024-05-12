package com.david.maman.errorserver.services;

import java.time.LocalDateTime;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.david.maman.errorserver.models.dto.ErrorLogDto;
import com.david.maman.errorserver.models.entity.ErrorLog;
import com.david.maman.errorserver.repositories.ErrorLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class KafkaErrorLogListener {

    private static final Logger logger = LoggerFactory.getLogger(KafkaErrorLogListener.class);

    @Autowired
    private ErrorLogRepository errorLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "test-topic")
    public void listen(ConsumerRecord<String, String> record){
        try{
            String messageKey = record.key();
            String jsonPayload = record.value();

            ErrorLogDto errorLogDto = objectMapper.readValue(jsonPayload, ErrorLogDto.class);

            logger.info("Received kafka message. key: {}, value: {}", messageKey, errorLogDto);

            ErrorLog errorLog = ErrorLog.builder()
                    .message(errorLogDto.getMessage())
                    .details(errorLogDto.getDetails())
                    .path(errorLogDto.getPath())
                    .timestamp(LocalDateTime.now())
                    .build();

            logger.info(errorLog.toString());

            errorLogRepository.save(errorLog);

        }catch(JsonProcessingException e){
            logger.error("Error processing message", e);
        }
    }

}
