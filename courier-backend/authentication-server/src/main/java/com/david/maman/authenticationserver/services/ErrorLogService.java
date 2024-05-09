package com.david.maman.authenticationserver.services;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.dto.ErrorLogDto;

@Service
public class ErrorLogService{

    @Autowired
    private KafkaTemplate<String, ErrorLogDto> kafkaTemplate;

    /*private String errorTopic = "error-logs";

    public void reportError(ErrorLogDto errorLogDto) {
        kafkaTemplate.send(errorTopic, errorLogDto);
    }*/

    public void reportError(ProducerRecord<String, ErrorLogDto> errorLogDto) {
        kafkaTemplate.send(errorLogDto.topic(), errorLogDto.key(), errorLogDto.value());
    }
}
