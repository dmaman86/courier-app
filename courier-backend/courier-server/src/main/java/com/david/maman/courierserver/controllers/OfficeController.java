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

import com.david.maman.courierserver.mappers.OfficeMapper;
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

    private final OfficeMapper officeMapper;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getOfficeById(@PathVariable Long id){
        try{
            Office office = officeService.findOfficeById(id).orElseThrow(
                () -> new Exception("Office not found")
            );
            logger.info("find office: {}", office);
            OfficeDto officeDto = officeMapper.toDto(office);
            return ResponseEntity.ok(officeDto);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOffices(){
        List<OfficeDto> officesDto = officeService.getAllOffices();
        return ResponseEntity.ok(officesDto);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllOffices(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){
        // List<OfficeDto> officesDto = officeService.getAllOffices();
        // logger.info("list officesDto: {}", officesDto);
        Pageable pageable = PageRequest.of(page, size);
        Page<Office> officesPage = officeService.findAllOffices(pageable);
        List<OfficeDto> officesDto = officesPage.getContent().stream().map(officeMapper::toDto).collect(Collectors.toList());
        Page<OfficeDto> officesDtoPage = new PageImpl<>(officesDto, pageable, officesPage.getTotalElements());
        
        return ResponseEntity.ok(officesDtoPage);
    }

    @PostMapping("/")
    public ResponseEntity<?> saveOffice(@RequestBody OfficeDto officeDto){
        OfficeDto createdOffice = officeService.createOffice(officeDto);
        return ResponseEntity.ok(createdOffice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatOffice(@PathVariable Long id, @RequestBody OfficeDto officeDto){
        OfficeDto updatedOffice = officeService.updateOffice(id, officeDto);
        return ResponseEntity.ok(updatedOffice);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteOffice(@PathVariable Long id){
        officeService.deleteOffice(id);
        return ResponseEntity.ok("Office deleted");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchOffice(@RequestParam("query") String query,
                                            @RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){
        // List<OfficeDto> officesDto = officeService.searchOffices(query);
        Page<Office> officesPage = officeService.searchOffices(query, page, size);
        List<OfficeDto> officesDto = officesPage.getContent().stream().map(officeMapper::toDto).collect(Collectors.toList());
        Page<OfficeDto> officesDtoPage = new PageImpl<>(officesDto, PageRequest.of(page, size), officesPage.getTotalElements());
        
        return ResponseEntity.ok(officesDtoPage);
    }

}
