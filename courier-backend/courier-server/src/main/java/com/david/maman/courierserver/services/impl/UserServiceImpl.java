package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.mappers.BranchMapper;
import com.david.maman.courierserver.mappers.ContactMapper;
import com.david.maman.courierserver.mappers.OfficeMapper;
import com.david.maman.courierserver.mappers.RoleMapper;
import com.david.maman.courierserver.mappers.UserMapper;
import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.BranchRepository;
import com.david.maman.courierserver.repositories.OfficeRepository;
import com.david.maman.courierserver.repositories.UserRepository;
import com.david.maman.courierserver.services.ContactService;
import com.david.maman.courierserver.services.KafkaProducerService;
import com.david.maman.courierserver.services.RoleService;
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
    private KafkaProducerService kafkaProducerUser;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ContactMapper contactMapper;

    @Autowired
    private OfficeRepository officeRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public Optional<User> loadUserByEmail(String email) {
        return userRepository.findByEmailAndIsActive(email, true);
    }

    @Override
    public UserDto loadUserDtoByEmail(String email) {
        User user = userRepository.findByEmailAndIsActive(email, true).get();
        return userMapper.toDto(user);
    }

    @Override
    public Optional<User> loadUserById(Long id) {
        return userRepository.findByIdAndIsActive(id, true);
    }

    private User save(User user) {
        User savedUser = userRepository.save(user);
        kafkaProducerUser.sendUser(savedUser);
        return savedUser;
    }

    @Override
    @Transactional
    public User createUser(UserDto userDto) {
        User user = userMapper.toEntity(userDto);

        return this.save(user);
    }

    @Override
    @Transactional
    public User createClient(ClientDto clientDto){
        User user = userMapper.clientDtoToUser(clientDto);
        user.setIsActive(true);

        Office office = officeRepository.findById(clientDto.getOffice().getId()).orElseThrow(
            () -> new IllegalArgumentException("Office not found")
        );

        List<Branch> branches = clientDto.getBranches().stream()
                            .map(branchDto -> branchRepository.findById(branchDto.getId()).orElseThrow(
                                () -> new IllegalArgumentException("Branch not found")
                            )).collect(Collectors.toList());


        Contact contact = contactMapper.toEntity(clientDto, office, branches);
        contactService.saveContact(contact);
        return this.save(user);
    }

    @Override
    @Transactional
    public User updateUser(User user, UserDto userDto) {
        Contact contact = contactService.findContactByPhone(userDto.getPhone()).orElse(null);

        if(contact != null){
            contactService.deleteContact(contact.getId());
        }
        User updateUser = userMapper.toEntity(userDto);
        updateUser.setRoles(user.getRoles());

        return this.save(updateUser);
    }

    @Override
    @Transactional
    public User updateClient(User user, ClientDto clientDto) {
        Contact existingContact = contactService.findContactByPhone(user.getPhone()).orElse(null);

        Office office = officeRepository.findById(clientDto.getOffice().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Office not found"));
        List<Branch> branches = clientDto.getBranches().stream()
                    .map(branchDTO -> branchRepository.findById(branchDTO.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Branch not found")))
                    .collect(Collectors.toList());

        if(existingContact == null){ // user update to client
            Contact contact = contactMapper.toEntity(clientDto, office, branches);
            contactService.saveContact(contact);
        }else{
            // update contact
            existingContact.setOffice(office);
            existingContact.setBranches(branches);
            contactService.saveContact(existingContact);
        }
        User updateUser = userMapper.clientDtoToUser(clientDto);
        return this.save(updateUser);
    }

    @Override
    public void delete(User user) {
        user.setIsActive(false);
        this.save(user);
    }

    @Override
    public List<UserDto> getAll() {
        List<User> users = new ArrayList<>();
        userRepository.findByIsActive(true).forEach(users::add);
        logger.info("Users: {}", users);
        // return userMapper.toDto(users);
        return users.stream().map(userMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<UserDto> searchUsers(String toSearch) {
        List<User> users = new ArrayList<>();

        users.addAll(userRepository.findByNameContainingAndIsActive(toSearch, true));
        users.addAll(userRepository.findByLastNameContainingAndIsActive(toSearch, true));
        users.addAll(userRepository.findByPhoneContainingAndIsActive(toSearch, true));
        users.addAll(userRepository.findByEmailContainingAndIsActive(toSearch, true));

        Set<User> uniqueUsers = new HashSet<>(users);
        // return new ArrayList<>(uniqueUsers);
        return uniqueUsers.stream().map(userMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public Optional<UserDto> findUserByUserDto(UserDto userDto) {
        User user = userRepository.findByNameAndLastNameAndPhoneAndEmailAndIsActive(
            userDto.getName(),
            userDto.getLastName(),   
            userDto.getPhone(), 
            userDto.getEmail(),
            true).orElse(null);

        return Optional.ofNullable(userMapper.toDto(user));
    }

}
