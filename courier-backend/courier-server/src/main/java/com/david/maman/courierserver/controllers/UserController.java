package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.helpers.CustomUserDetails;
import com.david.maman.courierserver.mappers.UserMapper;
import com.david.maman.courierserver.models.dto.ClientDto;
import com.david.maman.courierserver.models.dto.UserDto;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.User;
import com.david.maman.courierserver.services.ContactService;
import com.david.maman.courierserver.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courier/users")
@RequiredArgsConstructor
public class UserController {

    protected static Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final ContactService contactService;
    private final UserMapper userMapper;


    @PostMapping("/user")
    public ResponseEntity<?> register(@RequestBody UserDto userDto){
        if(userService.loadUserByEmail(userDto.getEmail()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        logger.info(userDto.toString());
        User createdUser = userService.createUser(userDto);
        UserDto createdUserDto = userMapper.toDto(createdUser);
        return ResponseEntity.ok(createdUserDto);
    }

    @PostMapping("/client")
    public ResponseEntity<?> registerClient(@RequestBody ClientDto clientDto){
        if(userService.loadUserByEmail(clientDto.getEmail()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        logger.info(clientDto.toString());
        User userRegisterByClient = userService.createClient(clientDto);
        return ResponseEntity.ok(userMapper.toDto(userRegisterByClient));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserLogged(Authentication authentication){
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        ClientDto loggedClient = buildClient(user.getUser());
        if(loggedClient != null){
            return ResponseEntity.ok(loggedClient);
        }        
        return ResponseEntity.ok(userMapper.toDto(user.getUser()));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id){
        User user = userService.loadUserById(id).orElseThrow(
            () -> new RuntimeException("User not found")
        );
        ClientDto client = buildClient(user);
        if(client != null){
            return ResponseEntity.ok(client);
        }
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    private ClientDto buildClient(User user){
        Contact contact = contactService.findContactByPhone(user.getPhone()).orElse(null);
        if(contact != null){
            return userMapper.toClientDto(user, contact);
        }
        return null;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_COURIER')")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        return ResponseEntity.ok(userService.getAll());
    }


    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_COURIER')")
    public ResponseEntity<?> getAllUsers(@RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "size", defaultValue = "10") int size){
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userService.getAllUsers(pageable);
        List<UserDto> userDtos = usersPage.stream().map(userMapper::toDto).collect(Collectors.toList());
        Page<UserDto> userDtoPage = new PageImpl<>(userDtos, pageable, usersPage.getTotalElements());

        return ResponseEntity.ok(userDtoPage);
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<?> getAllByRole(@PathVariable Long roleId, Authentication authentication){
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        boolean isAdmin = user.getUser().getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
        if(!isAdmin){
            throw new RuntimeException("Unauthorized");
        }
        List<UserDto> couriers = userService.getAllByRole(roleId);
        return ResponseEntity.ok(couriers);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        User user = userService.loadUserById(id).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        Contact contact = contactService.findContactByPhone(user.getPhone()).orElse(null);
        if(contact != null) contactService.deleteContact(contact.getId());
        userService.delete(user);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/user")
    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto){
        Optional<User> userDb = userService.loadUserById(userDto.getId());
        if(userDb.isEmpty()){
            throw new RuntimeException("User not found");
        }
            
        User updateUser = userService.updateUser(userDb.get(), userDto);
        UserDto updatedUserDto = userMapper.toDto(updateUser);
        return ResponseEntity.ok(updatedUserDto);
    }

    @PutMapping("/client")
    public ResponseEntity<?> updateClient(@RequestBody ClientDto clientDto){
        Optional<User> userDb = userService.loadUserById(clientDto.getId());
        if(userDb.isEmpty()){
            throw new RuntimeException("User not found");
        }
            
        userService.updateClient(userDb.get(), clientDto);
        return ResponseEntity.ok("User updated successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("query") String query,
                                        @RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "size", defaultValue = "10") int size){
        
        Page<User> usersPage = userService.searchUsers(query, page, size);
        List<UserDto> userDtos = usersPage.stream().map(userMapper::toDto).collect(Collectors.toList());
        Page<UserDto> userDtoPage = new PageImpl<>(userDtos, PageRequest.of(page, size), usersPage.getTotalElements());
        
        return ResponseEntity.ok(userDtoPage);
    }

}
