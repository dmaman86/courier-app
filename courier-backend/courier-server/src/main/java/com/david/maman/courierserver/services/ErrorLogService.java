package com.david.maman.courierserver.services;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.dto.ErrorLogDto;

@Service
public class ErrorLogService {

    @Autowired
    private KafkaTemplate<String, ErrorLogDto> kafkaTemplate;

    public void reportError(ProducerRecord<String, ErrorLogDto> errorLogDto) {
        kafkaTemplate.send(errorLogDto.topic(), errorLogDto.key(), errorLogDto.value());
    }

}
