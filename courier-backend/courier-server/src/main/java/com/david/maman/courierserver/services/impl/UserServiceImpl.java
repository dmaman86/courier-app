package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.models.entities.UserCredentials;
import com.david.maman.courierserver.repositories.UserCredentialsRepository;
import com.david.maman.courierserver.repositories.UserRepository;
import com.david.maman.courierserver.services.ContactService;
import com.david.maman.courierserver.services.UserService;

import jakarta.transaction.Transactional;

@Service
public class UserServiceImpl implements UserService{

    protected static Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactService contactService;

    @Autowired
    private UserCredentialsRepository userCredentialsRepository;

    @Override
    public Optional<User> loadUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDto loadUserDtoByEmail(String email) {
        User user = userRepository.findByEmail(email).get();
        return UserDto.toDto(user);
    }

    @Override
    public Optional<User> loadUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void createUser(UserDto userDto) {
        User user = User.builder()
            .name(userDto.getName())
            .lastName(userDto.getLastName())
            .email(userDto.getEmail())
            .phone(userDto.getPhone())
            .roles(Role.toEntity(userDto.getRoles()))
            .build();

        this.save(user);
        userCredentialsRepository.save(this.buildUserCredentials(user));
    }

    private UserCredentials buildUserCredentials(User user){
        return UserCredentials.builder()
            .user(user)
            .firstConnection(true)
            .build();
    }

    @Override
    public void updateUser(User user, UserDto userDto) {
        user.setName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());

        boolean hadClientRole = user.getRoles().stream().anyMatch(role -> "ROLE_CLIENT".equals(role.getName()));
        boolean hasClientRoleNow = userDto.getRoles().stream().anyMatch(role -> "ROLE_CLIENT".equals(role.getName()));

        if(hadClientRole && !hasClientRoleNow){
            Optional<Contact> contact = contactService.findContactByPhone(userDto.getPhone());
            if(contact.isPresent()){
                contactService.deleteContact(contact.get().getId());
            }
        }
        
        Set<Role> roles = Role.toEntity(userDto.getRoles());

        user.setRoles(roles);
        this.save(user);
    }

    @Override
    public void saveClientDto(ClientDto clientDto){
        this.createUser(clientDto);

        Contact contact = Contact.builder()
            .name(clientDto.getName())
            .lastName(clientDto.getLastName())
            .phone(clientDto.getPhone())
            .office(Office.toEntity(clientDto.getOffice()))
            .branches(new HashSet<>(Branch.toEntity(clientDto.getBranches())))
            .build();
        contactService.saveContact(contact);
    }

    @Override
    public void updateClient(User user, ClientDto clientDto) {
        this.updateUser(user, clientDto);
        Contact contact = contactService.findContactByPhone(clientDto.getPhone()).orElse(null);
        if(contact != null){
            contact.setName(clientDto.getName());
            contact.setLastName(clientDto.getLastName());
            contact.setOffice(Office.toEntity(clientDto.getOffice()));
            contact.setBranches(new HashSet<>(Branch.toEntity(clientDto.getBranches())));
            contactService.saveContact(contact);
        }
        
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDto> getAll() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);

        return UserDto.toDto(users);
    }

    @Override
    public List<User> searchUsers(String toSearch) {
        List<User> users = new ArrayList<>();

        users.addAll(userRepository.findByNameContaining(toSearch));
        users.addAll(userRepository.findByLastNameContaining(toSearch));
        users.addAll(userRepository.findByPhoneContaining(toSearch));
        users.addAll(userRepository.findByEmailContaining(toSearch));

        Set<User> uniqueUsers = new HashSet<>(users);
        return new ArrayList<>(uniqueUsers);
    }

    @Override
    public Optional<UserDto> findUserByUserDto(UserDto userDto) {
        User user = userRepository.findByNameAndLastNameAndPhoneAndEmail(
            userDto.getName(),
            userDto.getLastName(),   
            userDto.getPhone(), 
            userDto.getEmail()).orElse(null);

        return Optional.ofNullable(UserDto.toDto(user));
    }

}
