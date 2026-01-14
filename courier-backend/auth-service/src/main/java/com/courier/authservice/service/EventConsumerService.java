package com.courier.authservice.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;

public interface EventConsumerService {

  void handleUserCreated(ConsumerRecord<String, String> record);
}
