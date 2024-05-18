package com.david.maman.courierserver.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, User> kafkaTemplate;

    @Autowired
    private KafkaTemplate<String, Role> kafkaTemplateRole;

    public void sendUser(User user){
        String messageId = UUID.randomUUID().toString();
        kafkaTemplate.send("user-topic", messageId, user);
    }

    public void sendRole(Role role){
        String messageId = UUID.randomUUID().toString();
        kafkaTemplateRole.send("role-topic", messageId, role);
    }

    public void sendRoleToDelete(Role role){
        String messageId = UUID.randomUUID().toString();
        kafkaTemplateRole.send("delete-role-topic", messageId, role);
    }

}
