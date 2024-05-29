package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @GetMapping("/all")
    public ResponseEntity<?> getAllStatus(){
        return ResponseEntity.ok(statusService.getAll());
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllStatus(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Status> statusPage = statusService.getAll(pageable);
        List<StatusDto> statusDto = statusPage.getContent().stream().map(statusMapper::toDto).collect(Collectors.toList());
        Page<StatusDto> statusDtoPage = new PageImpl<>(statusDto, pageable, statusPage.getTotalElements());
        return ResponseEntity.ok(statusDtoPage);
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
