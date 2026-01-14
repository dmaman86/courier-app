package com.courier.userservice.manager;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.courier.userservice.exception.BusinessException;
import com.courier.userservice.exception.EntityExistsException;
import com.courier.userservice.exception.EntityNotFoundException;
import com.courier.userservice.feignclient.ResourceFeignClient;
import com.courier.userservice.objects.dto.ClientDto;
import com.courier.userservice.objects.dto.ContactDto;
import com.courier.userservice.objects.dto.UserDto;
import com.courier.userservice.objects.entity.User;
import com.courier.userservice.objects.mappers.ClientMapper;
import com.courier.userservice.objects.mappers.UserMapper;
import com.courier.userservice.repository.RoleRepository;
import com.courier.userservice.repository.UserRepository;
import com.courier.userservice.service.BlackListService;
import com.courier.userservice.service.EventProducerService;

@Component
public class UserManager {

  @Autowired private UserRepository userRepository;

  @Autowired private RoleRepository roleRepository;

  @Autowired private UserMapper userMapper;

  @Autowired private ClientMapper clientMapper;

  @Autowired private ResourceFeignClient resourceFeignClient;

  @Autowired private EventProducerService eventProducerService;

  @Autowired private BlackListService blackListService;

  @Transactional(readOnly = true)
  public UserDto getUserById(Long userId) {
    User user =
        userRepository
            .findByIdAndEnabledTrue(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

    boolean isClient =
        user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_CLIENT"));

    if (isClient) return getClientDto(user);

    return userMapper.toDto(user);
  }

  @Transactional
  public UserDto createUser(UserDto userDto) {
    validateUniqueFields(userDto);
    validateRoles(userDto);

    User user =
        User.builder()
            .email(userDto.getEmail())
            .phoneNumber(userDto.getPhoneNumber())
            .fullName(userDto.getFullName())
            .roles(userMapper.toEntity(userDto).getRoles())
            .build();

    UserDto savedUserDto = userMapper.toDto(userRepository.save(user));
    if (savedUserDto != null) eventProducerService.sendUserCreated(savedUserDto);
    return savedUserDto;
  }

  @Transactional
  public UserDto createClient(UserDto userDto, ContactDto contactDto) {
    ContactDto newContact = resourceFeignClient.createContact(contactDto);

    try {
      UserDto savedUserDto = createUser(userDto);
      return savedUserDto;
    } catch (Exception e) {
      resourceFeignClient.disableContact(newContact.getId());
      throw new BusinessException("Failed to create client: " + e.getMessage());
    }
  }

  // @Transactional
  // public UserDto createUser(UserDto userDto) {
  //   validateUniqueFields(userDto);
  //   validateRoles(userDto);
  //   UserDto savedUserDto = null;
  //
  //   if (!(userDto instanceof ClientDto)) {
  //     // User user = userRepository.save(userMapper.toEntity(userDto));
  //     User user =
  //         User.builder()
  //             .email(userDto.getEmail())
  //             .phoneNumber(userDto.getPhoneNumber())
  //             .fullName(userDto.getFullName())
  //             .roles(userMapper.toEntity(userDto).getRoles())
  //             .build();
  //
  //     savedUserDto = userMapper.toDto(userRepository.save(user));
  //   } else {
  //     savedUserDto = createClient(userDto);
  //   }
  //
  //   if (savedUserDto != null) eventProducerService.sendUserCreated(savedUserDto);
  //   return savedUserDto;
  // }

  // private UserDto createClient(UserDto userDto) {
  //   ContactDto contactDto = createContact(userDto);
  //   try {
  //     // User user = userRepository.save(userMapper.toEntity(userDto));
  //     User user =
  //         User.builder()
  //             .fullName(userDto.getFullName())
  //             .email(userDto.getEmail())
  //             .phoneNumber(userDto.getPhoneNumber())
  //             .roles(userMapper.toEntity(userDto).getRoles())
  //             .build();
  //
  //     return userMapper.toDto(userRepository.save(user));
  //   } catch (Exception e) {
  //     resourceFeignClient.disableContact(contactDto.getId());
  //     throw new BusinessException("Failed to create client: " + e.getMessage());
  //   }
  // }

  // private ContactDto createContact(UserDto userDto) {
  //   ContactDto contactDto = clientMapper.clientToContactDto((ClientDto) userDto);
  //   return resourceFeignClient.createContact(contactDto);
  // }

  @Transactional
  public UserDto updateUser(Long userId, UserDto userDto) {
    validateUpdatedField(userDto);
    validateRoles(userDto);

    User existingUser =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

    boolean wasClient = isClient(userMapper.toDto(existingUser));
    ContactDto contactBackup = resourceFeignClient.getContactByPhone(existingUser.getPhoneNumber());

    if (wasClient && contactBackup != null) {
      resourceFeignClient.disableContact(contactBackup.getId());
    }

    existingUser.setFullName(userDto.getFullName());
    existingUser.setEmail(userDto.getEmail());
    existingUser.setPhoneNumber(userDto.getPhoneNumber());
    existingUser.getRoles().clear();
    existingUser.getRoles().addAll(userMapper.toEntity(userDto).getRoles());
    return userMapper.toDto(userRepository.save(existingUser));
  }

  @Transactional
  public UserDto updateUser(Long userId, ClientDto clientDto) {
    validateUniqueFields((UserDto) clientDto);
    validateRoles((UserDto) clientDto);

    User existingUser =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

    boolean wasClient = isClient(userMapper.toDto(existingUser));
    ContactDto contactBackup = resourceFeignClient.getContactByPhone(existingUser.getPhoneNumber());

    if (!wasClient && contactBackup == null) {
      ContactDto contactDto = clientMapper.clientToContactDto(clientDto);
      ContactDto newContact = resourceFeignClient.createContact(contactDto);
    } else {
      contactBackup.setPhoneNumber(clientDto.getPhoneNumber());
      contactBackup.setFullName(clientDto.getFullName());
      contactBackup.setOffice(clientDto.getOffice());
      contactBackup.setBranches(clientDto.getBranches());
      resourceFeignClient.updateContact(contactBackup.getId(), contactBackup);
    }
    try {
      existingUser.setFullName(clientDto.getFullName());
      existingUser.setEmail(clientDto.getEmail());
      existingUser.setPhoneNumber(clientDto.getPhoneNumber());
      existingUser.getRoles().clear();
      existingUser.getRoles().addAll(userMapper.toEntity((UserDto) clientDto).getRoles());
      return userMapper.toDto(userRepository.save(existingUser));
    } catch (Exception e) {
      if (contactBackup != null) {
        resourceFeignClient.updateContact(contactBackup.getId(), contactBackup);
      }
      throw new BusinessException("Failed to update user: " + e.getMessage());
    }
  }

  // @Transactional
  // public UserDto updateUser(Long userId, UserDto userDto) {
  //   validateUpdatedField(userDto);
  //   validateRoles(userDto);
  //
  //   User existingUser =
  //       userRepository
  //           .findById(userId)
  //           .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
  //
  //   boolean wasClient = isClient(userMapper.toDto(existingUser));
  //   boolean isNowClient = isClient(userDto);
  //   ContactDto contactBackup = null;
  //   boolean contactCreated = false;
  //   boolean contactDisabled = false;
  //
  //   try {
  //     if (wasClient && !isNowClient) {
  //       contactBackup = getContactDto(existingUser.getPhoneNumber());
  //       resourceFeignClient.disableContact(contactBackup.getId());
  //       contactDisabled = true;
  //     }
  //     if (!wasClient && isNowClient) {
  //       contactBackup = createContact((ClientDto) userDto);
  //       contactCreated = true;
  //     }
  //
  //     existingUser.setFullName(userDto.getFullName());
  //     existingUser.setEmail(userDto.getEmail());
  //     existingUser.setPhoneNumber(userDto.getPhoneNumber());
  //     existingUser.getRoles().clear();
  //     existingUser.getRoles().addAll(userMapper.toEntity(userDto).getRoles());
  //     return userMapper.toDto(userRepository.save(existingUser));
  //   } catch (Exception e) {
  //     if (contactCreated) {
  //       resourceFeignClient.disableContact(contactBackup.getId());
  //     }
  //     if (contactDisabled) {
  //       resourceFeignClient.enableContact(contactBackup);
  //     }
  //     throw new BusinessException("Failed to update user: " + e.getMessage());
  //   }
  // }

  @Transactional
  public void disableUser(Long userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

    boolean wasClient = isClient(userMapper.toDto(user));
    ContactDto contactDto = null;

    try {
      if (wasClient) {
        contactDto = getContactDto(user.getPhoneNumber());
        resourceFeignClient.disableContact(contactDto.getId());
      }
      user.setEnabled(false);
      user.setDisabledAt(LocalDateTime.now());
      userRepository.save(user);
      blackListService.handleUserDisabledEvent(userId);
      // eventProducerService.sendUserDeleted(userId);
    } catch (Exception e) {
      if (wasClient && contactDto != null) {
        resourceFeignClient.enableContact(contactDto);
      }
      throw new BusinessException("Failed to disable user: " + e.getMessage());
    }
  }

  private ContactDto getContactDto(String userPhoneNumber) {
    return resourceFeignClient.getContactByPhone(userPhoneNumber);
  }

  private ClientDto getClientDto(User user) {
    ContactDto contactDto = resourceFeignClient.getContactByPhone(user.getPhoneNumber());
    return clientMapper.fromUserAndContact(userMapper.toDto(user), contactDto);
  }

  private void validateUniqueFields(UserDto userDto) {

    userRepository
        .findByEmailOrPhoneNumberAndEnabledTrue(userDto.getEmail(), userDto.getPhoneNumber())
        .ifPresent(
            existingUser -> {
              throw new EntityExistsException(
                  "User already exists: " + userDto.getEmail() + " or " + userDto.getPhoneNumber());
            });
  }

  private void validateUpdatedField(UserDto userDto) {
    User existingUser =
        userRepository
            .findById(userDto.getId())
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userDto.getId()));

    userRepository
        .findByEmailOrPhoneNumberAndEnabledTrue(userDto.getEmail(), userDto.getPhoneNumber())
        .ifPresent(
            userDb -> {
              if (!userDb.getId().equals(existingUser.getId())) {
                throw new EntityExistsException(
                    "User already exists: "
                        + userDto.getEmail()
                        + " or "
                        + userDto.getPhoneNumber());
              }
            });
  }

  private boolean isClient(UserDto userDto) {
    return userDto.getRoles().stream().anyMatch(role -> "ROLE_CLIENT".equals(role.getName()));
  }

  private void validateRoles(UserDto userDto) {

    boolean allRolesValid =
        userDto.getRoles().stream()
            .allMatch(roleDto -> roleRepository.existsByNameAndEnabledTrue(roleDto.getName()));

    if (!allRolesValid) {
      throw new EntityNotFoundException("One or more roles are not found or disabled");
    }
  }
}
