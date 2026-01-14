package com.courier.userservice.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.courier.userservice.exception.EntityNotFoundException;
import com.courier.userservice.feignclient.ResourceFeignClient;
import com.courier.userservice.manager.UserManager;
import com.courier.userservice.objects.criteria.UserCriteria;
import com.courier.userservice.objects.dto.ClientDto;
import com.courier.userservice.objects.dto.ContactDto;
import com.courier.userservice.objects.dto.UserDto;
import com.courier.userservice.objects.entity.User;
import com.courier.userservice.objects.mappers.UserMapper;
import com.courier.userservice.objects.request.UserSearchRequest;
import com.courier.userservice.objects.request.UsersContactSearchRequest;
import com.courier.userservice.repository.UserRepository;
import com.courier.userservice.service.UserService;

@Service
public class UserServiceImpl implements UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  @Autowired private UserRepository userRepository;

  @Autowired private UserMapper userMapper;

  @Autowired private UserManager userManager;

  @Autowired private ResourceFeignClient resourceFeignClient;

  @Override
  public Page<UserDto> getUsers(Pageable pageable) {
    return userRepository.findByEnabledTrue(pageable).map(userMapper::toDto);
  }

  @Override
  public List<UserDto> getUsers() {
    return userRepository.findByEnabledTrue().stream()
        .map(userMapper::toDto)
        .collect(Collectors.toList());
  }

  @Override
  public List<UserDto> getUsersByRole(String roleName) {
    return userRepository.findByRolesNameAndEnabledTrue(roleName).stream()
        .map(userMapper::toDto)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public UserDto getUserById(Long id) {
    return userManager.getUserById(id);
  }

  @Override
  @Transactional(readOnly = true)
  public UserDto getUserByEmailOrPhone(String email, String phoneNumber) {
    UserDto user =
        userRepository
            .findByEmailOrPhoneNumber(email, phoneNumber)
            .map(userMapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email or phone"));

    logger.info("User found: {}", user);
    return user;
  }

  @Override
  public UserDto createUser(UserDto userDto) {
    return userManager.createUser(userDto);
  }

  @Override
  public UserDto createUser(UserDto userDto, ContactDto contactDto) {
    return userManager.createClient(userDto, contactDto);
  }

  @Override
  public UserDto updateUser(Long id, UserDto userDto) {
    return userManager.updateUser(id, userDto);
  }

  @Override
  public UserDto updateUser(Long id, ClientDto clientDto) {
    return userManager.updateUser(id, clientDto);
  }

  @Override
  public void disableUser(Long id) {
    userManager.disableUser(id);
  }

  @Override
  public Page<UserDto> searchUsers(String search, Pageable pageable) {
    if (search == null || search.trim().isEmpty()) {
      return Page.empty();
    }

    Specification<User> specification = UserCriteria.containsTextInAttributes(search);
    Page<User> users = userRepository.findAll(specification, pageable);
    return users.map(userMapper::toDto);
  }

  @Override
  public Page<UserDto> advancedSearch(UserSearchRequest request, int page, int size) {
    List<String> clientPhoneNumbers = null;

    if (isClientFilter(request)) {
      UsersContactSearchRequest contactSearch = buildContactSearchRequest(request);
      List<ContactDto> contacts =
          resourceFeignClient.searchUsersContacts(contactSearch, page, size);
      logger.info("Contacts found: {}", contacts);
      clientPhoneNumbers =
          contacts.stream().map(ContactDto::getPhoneNumber).filter(Objects::nonNull).toList();
      logger.info("Client phone numbers: {}", clientPhoneNumbers);
    }

    Specification<User> specification = UserCriteria.advancedSearch(request, clientPhoneNumbers);
    Pageable pageable = PageRequest.of(page, size);
    Page<User> users = userRepository.findAll(specification, pageable);
    return users.map(userMapper::toDto);
  }

  private boolean isClientFilter(UserSearchRequest request) {
    boolean isClient =
        request.getRoles() != null
            && request.getRoles().stream().anyMatch(role -> "ROLE_CLIENT".equals(role.getName()));
    return isClient
        || ((request.getOffices() != null && !request.getOffices().isEmpty())
            || (request.getBranches() != null && !request.getBranches().isEmpty())
            || request.getAddress() != null);
  }

  private UsersContactSearchRequest buildContactSearchRequest(UserSearchRequest request) {
    return UsersContactSearchRequest.builder()
        .fullName(request.getFullName())
        .phoneNumber(request.getPhoneNumber())
        .offices(request.getOffices())
        .branches(request.getBranches())
        .address(request.getAddress())
        .build();
  }
}
