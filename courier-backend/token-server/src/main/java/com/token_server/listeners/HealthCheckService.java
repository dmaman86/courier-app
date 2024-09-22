package com.token_server.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthCheckService {

    private static final Logger logger = LoggerFactory.getLogger(HealthCheckService.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void notifyStartup(){
        kafkaTemplate.send("token-server-health", "token-server-restarted");
        logger.info("Token server restarted, sent health check message");
    }

}
