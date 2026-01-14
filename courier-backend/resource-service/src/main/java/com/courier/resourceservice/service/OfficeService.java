package com.courier.resourceservice.service;

import java.util.List;

import com.courier.resourceservice.objects.dto.OfficeBaseDto;

public interface OfficeService {

  // Page<OfficeResponse> getOffices(Pageable pageable);

  List<OfficeBaseDto> getOfficesWithoutPagination();

  OfficeBaseDto getOfficeBaseById(Long id);

  // OfficeDto getOfficeById(Long id);

  OfficeBaseDto createOffice(OfficeBaseDto officeBaseDto);

  // OfficeResponse createOfficeWithBranches(OfficeDto officeDto);

  OfficeBaseDto updateOffice(Long id, OfficeBaseDto officeDto);

  void disabledOffice(Long id);

  // Page<OfficeResponse> searchOffices(String searchQuery, Pageable pageable);
}
