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


@Service
public class KafkaErrorLogListener {

    private static final Logger logger = LoggerFactory.getLogger(KafkaErrorLogListener.class);

    @Autowired
    private ErrorLogRepository errorLogRepository;

    @KafkaListener(topics = "test-topic", containerFactory = "errorLogDtoKafkaListenerContainerFactory")
    public void listen(ConsumerRecord<String, ErrorLogDto> record){
        String messageKey = record.key();
        ErrorLogDto errorLogDto = record.value();

        logger.info("Received kafka message. key: {}, value: {}", messageKey, errorLogDto);

        ErrorLog errorLog = ErrorLog.builder()
                    .message(errorLogDto.getMessage())
                    .details(errorLogDto.getDetails())
                    .path(errorLogDto.getPath())
                    .timestamp(LocalDateTime.now())
                    .build();

        logger.info(errorLog.toString());

        errorLogRepository.save(errorLog);
    }

}
