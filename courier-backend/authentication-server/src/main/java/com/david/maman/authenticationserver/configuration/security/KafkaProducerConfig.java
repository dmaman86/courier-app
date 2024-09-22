package com.david.maman.authenticationserver.configuration.security;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.david.maman.authenticationserver.models.dto.ErrorLogDto;

@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    <T> ProducerFactory<String, T> producerFactory(){
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);


        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    <T> KafkaTemplate<String, T> kafkaTemplate(){
        return new KafkaTemplate<>(producerFactory());
    } 

    /*@Bean
    Map<String, Object> producerConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        return props;
    }

    @Bean
    Map<String, Object> stringProducerConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return props;
    }

    @Bean
    ProducerFactory<String, ErrorLogDto> producerFactory(){
        return new DefaultKafkaProducerFactory<>(producerConfig(), new StringSerializer(),
                new JsonSerializer<ErrorLogDto>());
    }

    @Bean
    KafkaTemplate<String, ErrorLogDto> kafkaTemplate(){
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    ProducerFactory<String, String> stringProducerFactory() {
        return new DefaultKafkaProducerFactory<>(stringProducerConfig());
    }

    @Bean
    KafkaTemplate<String, String> stringKafkaTemplate() {
        return new KafkaTemplate<>(stringProducerFactory());
    }*/

}
