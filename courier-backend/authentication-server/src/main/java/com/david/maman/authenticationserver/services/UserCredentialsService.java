package com.david.maman.authenticationserver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.authenticationserver.models.entities.User;
import com.david.maman.authenticationserver.models.entities.UserCredentials;
import com.david.maman.authenticationserver.repositories.UserCredentialsRepository;
import com.david.maman.authenticationserver.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserCredentialsService {

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void createCredentials(User user){

        var userDb = userRepository.findByEmail(user.getEmail());
        if(!userDb.isPresent()){
            user = userRepository.save(user);
        }else{
            User existUser = userDb.get();
            existUser.setName(user.getName());
            existUser.setLastName(user.getLastName());
            existUser.setPhone(user.getPhone());
            existUser.setIsActive(user.getIsActive());
            existUser.setRoles(user.getRoles());
            existUser.setEmail(user.getEmail());
            user = userRepository.save(existUser);
        }
        var userCredentials = userCredentialsRepository.findByUserEmail(user.getEmail());
        if(!userCredentials.isPresent()){
            UserCredentials credentials = UserCredentials.builder()
                .user(user)
                .firstConnection(true)
                .build();
        
            userCredentialsRepository.save(credentials);
        }
        
    }

}
