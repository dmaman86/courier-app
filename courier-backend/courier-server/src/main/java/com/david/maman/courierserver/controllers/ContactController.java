package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.mappers.ContactMapper;
import com.david.maman.courierserver.models.dto.ContactDto;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.services.ContactService;


@RestController
@RequestMapping("/api/courier/contact")
public class ContactController {

    protected static Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactMapper contactMapper;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id){
        try{
            Contact contact = contactService.findContactById(id).orElseThrow(
                () -> new Exception("Contact not found")
            );
            return ResponseEntity.ok(contactMapper.toDto(contact));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllContacts(){
        List<Contact> contacts = contactService.findAllContacts();
        List<ContactDto> contactDtos = contacts.stream().map(contactMapper::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(contactDtos);
    }

    @GetMapping("/office/{officeId}/branch/{branchId}")
    public ResponseEntity<?> getContactsByOfficeAndBranch(@PathVariable Long officeId, @PathVariable Long branchId){
        List<Contact> contacts = contactService.getContactsByOfficeIdAndBranchId(officeId, branchId);
        List<ContactDto> contactDtos = contacts.stream().map(contactMapper::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(contactDtos);

    }

    @GetMapping("/")
    public ResponseEntity<?> getAllContacts(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<Contact> contactsPage = contactService.findAllContacts(pageable);
        List<ContactDto> contactDtos = contactsPage.stream().map(contactMapper::toDto).collect(Collectors.toList());
        Page<ContactDto> contactDtoPage = new PageImpl<>(contactDtos, pageable, contactsPage.getTotalElements());
        return ResponseEntity.ok(contactDtoPage);
    }

    /*@GetMapping("/search")
    public ResponseEntity<List<ContactDto>> searchContacts(@RequestParam("query") String query) {
        List<ContactDto> result = contactService.searchContacts(query);
        return ResponseEntity.ok(result);
    }*/

    @GetMapping("/search")
    public ResponseEntity<Page<ContactDto>> searchContacts(@RequestParam("query") String query,
                                                            @RequestParam(value = "page", defaultValue = "0") int page,
                                                            @RequestParam(value = "size", defaultValue = "10") int size){
        Page<Contact> contactsPage = contactService.searchContacts(query, page, size);
        List<ContactDto> contactsDto = contactsPage.stream().map(contactMapper::toDto).collect(Collectors.toList());
        Page<ContactDto> contactDtoPage = new PageImpl<>(contactsDto, PageRequest.of(page, size), contactsPage.getTotalElements());
        return ResponseEntity.ok(contactDtoPage);                                                        
    }

    @PostMapping("/")
    public ResponseEntity<?> saveContact(@RequestBody ContactDto contactDto){
        try{
            Optional<Contact> contactDb = contactService.findContactByNameAndLastNameAndPhone(contactDto);
            if(contactDb.isPresent()){
                throw new Exception("Contact already exists");
            }
            // Contact contact = contactMapper.toEntity(contactDto);
            // contactService.saveContact(contact);
            return ResponseEntity.ok(contactDb);
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
