package com.courier.resourceservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.service.OfficeService;

@RestController
@RequestMapping("/api/resource/office")
public class OfficeController {

  private static final Logger logger = LoggerFactory.getLogger(OfficeController.class);

  @Autowired private OfficeService officeService;

  // @GetMapping
  // public ResponseEntity<Page<OfficeResponse>> getAllOffices(Pageable pageable) {
  //   return ResponseEntity.ok(officeService.getOffices(pageable));
  // }

  @GetMapping("/all")
  public ResponseEntity<List<OfficeBaseDto>> getAllOfficesWithoutPagination() {
    return ResponseEntity.ok(officeService.getOfficesWithoutPagination());
  }

  @GetMapping("/{id}")
  public ResponseEntity<OfficeBaseDto> getOfficeBaseById(@PathVariable Long id) {
    return ResponseEntity.ok(officeService.getOfficeBaseById(id));
  }

  // @GetMapping("/dto/{id}")
  // public ResponseEntity<OfficeDto> getOfficeById(@PathVariable Long id) {
  //   return ResponseEntity.ok(officeService.getOfficeById(id));
  // }

  // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  // @PostMapping("/base")
  // public ResponseEntity<OfficeResponse> createOffice(@RequestBody OfficeBaseDto officeBaseDto) {
  //   logger.info("Get officeBaseDto: {}", officeBaseDto);
  //   return ResponseEntity.ok(officeService.createOffice(officeBaseDto));
  // }

  // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  // @PostMapping
  // public ResponseEntity<OfficeResponse> createOfficeWithBranches(@RequestBody OfficeDto
  // officeDto) {
  //   return ResponseEntity.ok(officeService.createOfficeWithBranches(officeDto));
  // }

  // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  // @PutMapping("/{id}")
  // public ResponseEntity<OfficeResponse> updateOffice(
  //     @PathVariable Long id, @RequestBody OfficeDto officeDto) {
  //   return ResponseEntity.ok(officeService.updateOffice(id, officeDto));
  // }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> disableOffice(@PathVariable Long id) {
    officeService.disabledOffice(id);
    return ResponseEntity.noContent().build();
  }

  // @GetMapping("/search")
  // public ResponseEntity<Page<OfficeResponse>> searchOffices(
  //     @RequestParam String query, Pageable pageable) {
  //   return ResponseEntity.ok(officeService.searchOffices(query, pageable));
  // }
}
