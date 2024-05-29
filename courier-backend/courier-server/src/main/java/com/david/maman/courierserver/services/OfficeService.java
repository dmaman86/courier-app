package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.david.maman.courierserver.models.dto.OfficeDto;
import com.david.maman.courierserver.models.entities.Office;

public interface OfficeService {

    Optional<Office> findOfficeById(Long id);

    Optional<Office> findOfficeByName(String name);

    void saveOffice(Office office);

    OfficeDto createOffice(OfficeDto officeDto);

    OfficeDto updateOffice(Long officeId, OfficeDto officeDto);

    void deleteOffice(Long id);

    List<Office> findAllOffices();

    List<OfficeDto> getAllOffices();

    Page<Office> findAllOffices(Pageable pageable);

    List<Office> searchOfficesByName(String name);

    Page<Office> searchOffices(String toSearch, int page, int size);
    
}
