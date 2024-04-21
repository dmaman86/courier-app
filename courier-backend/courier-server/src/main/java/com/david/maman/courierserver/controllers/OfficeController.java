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

import com.david.maman.courierserver.models.dto.OfficeDto;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.services.OfficeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courier/office")
@RequiredArgsConstructor
public class OfficeController {

    protected static Logger logger = LoggerFactory.getLogger(OfficeController.class);

    private final OfficeService officeService;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getOfficeById(@PathVariable Long id){
        try{
            Office office = officeService.findOfficeById(id).orElseThrow(
                () -> new Exception("Office not found")
            );
            return ResponseEntity.ok(office);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllOffices(){
        return ResponseEntity.ok(officeService.findAllOffices());
    }

    @PostMapping("/")
    public ResponseEntity<?> saveOffice(@RequestBody OfficeDto officeDto){
        try{
            Optional<Office> officeDb = officeService.findOfficeByName(officeDto.getName());
            if(officeDb.isPresent()){
                throw new Exception("Office already exists");
            }
            Office office = Office.toEntity(officeDto);
            officeService.saveOffice(office);
            return ResponseEntity.ok(office);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updatOffice(@RequestBody Office office){
        try{
            Optional<Office> officeDb = officeService.findOfficeById(office.getId());
            if(officeDb.isEmpty()){
                throw new Exception("Office not found");
            }
            officeService.saveOffice(office);
            return ResponseEntity.ok(office);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteOffice(@PathVariable Long id){
        try{
            Optional<Office> office = officeService.findOfficeById(id);
            if(office.isEmpty()){
                throw new Exception("Office not found");
            }
            officeService.deleteOffice(id);
            return ResponseEntity.ok("Office deleted");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
