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

import com.david.maman.courierserver.models.dto.StatusDto;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.services.StatusService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courier/status")
@RequiredArgsConstructor
public class StatusController {

    protected static Logger logger = LoggerFactory.getLogger(StatusController.class);

    private final StatusService statusService;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getStatusById(@PathVariable Long id){
        try {
            Status status = statusService.findStatusById(id).orElseThrow(
                () -> new Exception("Status not found")
            );
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllStatus(){
        return ResponseEntity.ok(statusService.getAll());
    }

    @PostMapping("/")
    public ResponseEntity<?> saveStatus(@RequestBody StatusDto statusDto){
        try{
            Optional<Status> statusDb = statusService.findStatusByName(statusDto.getName());
            if(statusDb.isPresent()){
                throw new Exception("Status already exists");
            }
            Status status = Status.toEntity(statusDto);
            statusService.saveStatus(status);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updateStatus(@RequestBody Status status){
        try{
            Optional<Status> statusDb = statusService.findStatusById(status.getId());
            if(statusDb.isEmpty()){
                throw new Exception("Status not found");
            }
            statusService.saveStatus(status);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable Long id){
        try{
            Optional<Status> statusDb = statusService.findStatusById(id);
            if(statusDb.isEmpty()){
                throw new Exception("Status not found");
            }
            statusService.deleteStatus(id);
            return ResponseEntity.ok("Status deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
