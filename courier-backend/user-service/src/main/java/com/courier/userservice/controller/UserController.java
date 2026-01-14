package com.courier.userservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.courier.userservice.exception.BusinessException;
import com.courier.userservice.objects.dto.ClientDto;
import com.courier.userservice.objects.dto.ContactDto;
import com.courier.userservice.objects.dto.UserDto;
import com.courier.userservice.objects.mappers.ClientMapper;
import com.courier.userservice.objects.request.UserSearchRequest;
import com.courier.userservice.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired private UserService userService;

  @Autowired private ClientMapper clientMapper;

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @GetMapping
  public ResponseEntity<Page<UserDto>> getAllUsers(Pageable pageable) {
    return ResponseEntity.ok(userService.getUsers(pageable));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @GetMapping("/all")
  public ResponseEntity<List<UserDto>> getAllUsers() {
    return ResponseEntity.ok(userService.getUsers());
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @GetMapping("/role/{roleName}")
  public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String roleName) {
    return ResponseEntity.ok(userService.getUsersByRole(roleName));
  }

  @PreAuthorize(
      "hasAnyAuthority('ROLE_ADMIN', 'ROLE_COURIER') or #userId == authentication.principal.id")
  @GetMapping("/{userId}")
  public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
    return ResponseEntity.ok(userService.getUserById(userId));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @PostMapping
  public ResponseEntity<UserDto> createUser(@RequestBody ClientDto clientDto) {
    UserDto userDto = (UserDto) clientDto;
    // boolean isSimpleUser =
    //     clientDto.getOffice() == null
    //         && (clientDto.getBranches() == null || clientDto.getBranches().isEmpty());

    if (!isClient(clientDto)) return ResponseEntity.ok(userService.createUser(userDto));

    ContactDto contactDto = clientMapper.clientToContactDto(clientDto);
    return ResponseEntity.ok(userService.createUser(userDto, contactDto));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @PutMapping("/{userId}")
  public ResponseEntity<UserDto> updateUser(
      @PathVariable Long userId, @RequestBody ClientDto clientDto) {
    if (!isClient(clientDto))
      return ResponseEntity.ok(userService.updateUser(userId, (UserDto) clientDto));

    return ResponseEntity.ok(userService.updateUser(userId, clientDto));
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> disableUser(@PathVariable Long userId) {
    userService.disableUser(userId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/find-by-email-or-phone")
  public ResponseEntity<UserDto> getUserByEmailOrPhone(
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String phoneNumber) {

    if (email == null && phoneNumber == null) {
      throw new BusinessException("Either email or phone must be provided");
    }
    UserDto user = userService.getUserByEmailOrPhone(email, phoneNumber);
    logger.info("User found: {}", user);
    return ResponseEntity.ok(user);
  }

  @GetMapping("/search")
  public ResponseEntity<Page<UserDto>> searchUsers(@RequestParam String query, Pageable pageable) {
    return ResponseEntity.ok(userService.searchUsers(query, pageable));
  }

  private boolean isClient(ClientDto dto) {
    boolean hasOfficeAndBranches =
        dto.getOffice() != null && dto.getBranches() != null && !dto.getBranches().isEmpty();

    boolean hasClientRole =
        dto.getRoles() != null
            && dto.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_CLIENT"));

    return hasOfficeAndBranches && hasClientRole;
  }

  @PostMapping("/advanced-search")
  public ResponseEntity<Page<UserDto>> advancedSearch(
      @RequestBody UserSearchRequest request,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    logger.info("Advanced search request: {}", request);
    return ResponseEntity.ok(userService.advancedSearch(request, page, size));
  }
}
