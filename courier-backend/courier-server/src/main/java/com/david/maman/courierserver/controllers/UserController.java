package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/user")
    public ResponseEntity<?> register(@RequestBody UserDto userDto){
        try{
            if(userService.loadUserByEmail(userDto.getEmail()).isPresent()){
                throw new RuntimeException("User already exists");
            }
            logger.info(userDto.toString());
            userService.saveUserDto(userDto);
            return ResponseEntity.ok("User registered successfully");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/client")
    public ResponseEntity<?> registerClient(@RequestBody ClientDto clientDto){
        try{
            if(userService.loadUserByEmail(clientDto.getEmail()).isPresent()){
                throw new RuntimeException("User already exists");
            }
            logger.info(clientDto.toString());
            userService.saveClientDto(clientDto);
            return ResponseEntity.ok("Client registered successfully");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id){
        try{
            User user = userService.loadUserById(id).orElseThrow(
                () -> new Exception("User not found")
            );
            UserDto userDto = UserDto.toDto(user);
            return ResponseEntity.ok(userDto);
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        return ResponseEntity.ok(userService.getAll());
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        try{
            User user = userService.loadUserById(id).orElseThrow(
                () -> new Exception("User not found")
            );
            Contact contact = contactService.findContactByPhone(user.getPhone()).orElse(null);
            if(contact != null) contactService.deleteContact(contact.getId());
            userService.delete(user.getId());
            return ResponseEntity.ok("User deleted successfully");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/user")
    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto){
        try{
            Optional<User> userDb = userService.loadUserById(userDto.getId());
            if(userDb.isEmpty()){
                throw new RuntimeException("User not found");
            }
            
            userService.updateUser(userDb.get(), userDto);
            return ResponseEntity.ok("User updated successfully");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/client")
    public ResponseEntity<?> updateClient(@RequestBody ClientDto clientDto){
        try{
            Optional<User> userDb = userService.loadUserById(clientDto.getId());
            if(userDb.isEmpty()){
                throw new RuntimeException("User not found");
            }
            
            userService.updateClient(userDb.get(), clientDto);
            return ResponseEntity.ok("User updated successfully");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/search/{toSearch}")
    public ResponseEntity<?> searchUsers(String toSearch){
        return ResponseEntity.ok(userService.searchUsers(toSearch));
    }

}
