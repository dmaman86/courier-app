package com.david.maman.authenticationserver.services;

import java.util.UUID;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.dto.ErrorLogDto;

@Service
public class ErrorLogService{

    @Autowired
    private KafkaTemplate<String, ErrorLogDto> kafkaTemplate;

    public void reportError(ErrorLogDto errorLogDto) {
        String messageId = UUID.randomUUID().toString();
        kafkaTemplate.send("test-topic", messageId, errorLogDto);
    }
}
