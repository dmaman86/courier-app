package com.david.maman.courierserver.configuration.security;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    NewTopic generateTopic(){

        Map<String, String> configs = new HashMap<>();
        configs.put(TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_DELETE);// delete, compact
        configs.put(TopicConfig.RETENTION_MS_CONFIG, "86400000");// 1 dia retiene el mensaje en el topic
        configs.put(TopicConfig.SEGMENT_BYTES_CONFIG, "1073741824"); // 1GB el segmento de log de cada particion del topic
        configs.put(TopicConfig.MAX_MESSAGE_BYTES_CONFIG, "1048576"); // 1MB el maximo de bytes por mensaje en el topic

        return TopicBuilder.name("test-topic")
                            .partitions(2)
                            .replicas(2)
                            .configs(configs)
                            .build();
    }
    
}
