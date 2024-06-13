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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.mappers.ContactMapper;
import com.david.maman.courierserver.mappers.UserMapper;
import com.david.maman.courierserver.models.criteria.UserSepecification;
import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.RoleDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.models.entities.Role;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.repositories.BranchRepository;
import com.david.maman.courierserver.repositories.OfficeRepository;
import com.david.maman.courierserver.repositories.RoleRepository;
import com.david.maman.courierserver.repositories.UserRepository;
import com.david.maman.courierserver.services.ContactService;
import com.david.maman.courierserver.services.KafkaProducerService;
import com.david.maman.courierserver.services.UserService;

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

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Optional<User> loadUserByEmail(String email) {
        return userRepository.findByEmailAndIsActive(email, true);
    }

    @Override
    public Optional<User> loadUserByEmailAndPhone(String email, String phone){
        return userRepository.findByEmailAndPhoneAndIsActive(email, phone, true);
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

        Set<Role> managedRoles = getRolesFromDto(userDto.getRoles());
        /*new HashSet<>();
        for(RoleDto roleDto : userDto.getRoles()){
            Role role = roleRepository.findById(roleDto.getId()).orElseThrow(
                () -> new IllegalArgumentException("Role not found")
            );
            managedRoles.add(role);
        }*/
        user.setRoles(managedRoles);

        return this.save(user);
    }

    private Set<Role> getRolesFromDto(Set<RoleDto> rolesDto){
        Set<Role> roles = new HashSet<>();
        for(RoleDto roleDto : rolesDto){
            Role role = roleRepository.findById(roleDto.getId()).orElseThrow(
                () -> new IllegalArgumentException("Role not found")
            );
            roles.add(role);
        }
        return roles;
    }

    @Override
    @Transactional
    public User createClient(ClientDto clientDto){
        Set<Role> managedRoles = getRolesFromDto(clientDto.getRoles());
        User user = userMapper.clientDtoToUser(clientDto);
        user.setRoles(managedRoles);
        user.setIsActive(true);
        logger.info("User: {}", user);

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
    @Transactional(readOnly = true)
    public Page<User> getAllUsers(Pageable pageable){
        return userRepository.findByIsActive(true, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllByRole(Long roleId){
        Role role = roleRepository.findById(roleId).orElseThrow(
            () -> new IllegalArgumentException("Role not found")
        );
        return userRepository.findAllByRolesAndIsActive(role, true).stream()
                .map(userMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> searchUsers(String toSearch, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        String[] searchTerms = toSearch.split("\\s+");
        Set<User> uniqueUsers = new HashSet<>();

        for(String term : searchTerms){
            Specification<User> spec = Specification.where(UserSepecification.containsTextInAttributes(term, true));
            uniqueUsers.addAll(userRepository.findAll(spec, pageable).getContent());
        }
        List<User> uniqueUsersList = new ArrayList<>(uniqueUsers);

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), uniqueUsersList.size());
        return new PageImpl<>(uniqueUsersList.subList(start, end), pageable, uniqueUsersList.size());
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
