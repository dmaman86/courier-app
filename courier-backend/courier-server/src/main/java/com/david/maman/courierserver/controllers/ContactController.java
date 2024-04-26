package com.david.maman.courierserver.controllers;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.models.dto.ContactDto;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.services.ContactService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courier/contact")
@RequiredArgsConstructor
public class ContactController {

    protected static Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id){
        try{
            Contact contact = contactService.findContactById(id).orElseThrow(
                () -> new Exception("Contact not found")
            );
            return ResponseEntity.ok(contact);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllContacts(){
        return ResponseEntity.ok(contactService.findAllContacts());
    }

    @GetMapping("/search/{toSearch}")
    public ResponseEntity<?> searchContacts(@PathVariable String toSearch){
        return ResponseEntity.ok(contactService.searchContacts(toSearch));
    }

    @PostMapping("/")
    public ResponseEntity<?> saveContact(@RequestBody ContactDto contactDto){
        try{
            Optional<Contact> contactDb = contactService.findContactByNameAndLastNameAndPhone(contactDto);
            if(contactDb.isPresent()){
                throw new Exception("Contact already exists");
            }
            Contact contact = Contact.toEntity(contactDto);
            contactService.saveContact(contact);
            return ResponseEntity.ok(contact);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updateContact(@RequestBody Contact contact){
        try{
            Optional<Contact> contactDb = contactService.findContactById(contact.getId());
            if(contactDb.isEmpty()){
                throw new Exception("Contact not found");
            }
            contactService.saveContact(contact);
            return ResponseEntity.ok(contact);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id){
        try{
            Optional<Contact> contact = contactService.findContactById(id);
            if(contact.isEmpty()){
                throw new Exception("Contact not found");
            }
            contactService.deleteContact(id);
            return ResponseEntity.ok("Contact deleted");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}