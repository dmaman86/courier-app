package com.david.maman.courierserver.controllers;

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

import com.david.maman.courierserver.mappers.StatusMapper;
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

    private final StatusMapper statusMapper;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getStatusById(@PathVariable Long id){
        StatusDto statusDto = statusService.findStatusById(id);
        return ResponseEntity.ok(statusDto);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllStatus(){
        return ResponseEntity.ok(statusService.getAll());
    }

    @PostMapping("/")
    public ResponseEntity<?> saveStatus(@RequestBody StatusDto statusDto){
        Status status = statusService.saveStatus(statusDto);
            
        return ResponseEntity.ok(statusMapper.toDto(status));
    }

    @PutMapping("/")
    public ResponseEntity<?> updateStatus(@RequestBody StatusDto statusDto){
        Status status = statusService.updateStatus(statusDto);
        return ResponseEntity.ok(statusMapper.toDto(status));
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable Long id){
        statusService.deleteStatus(id);
        return ResponseEntity.ok("Status deleted");
    }
}
