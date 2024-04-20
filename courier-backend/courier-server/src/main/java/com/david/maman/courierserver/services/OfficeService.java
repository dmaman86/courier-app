package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.entities.Office;

public interface OfficeService {

    Optional<Office> findOfficeById(Long id);

    Optional<Office> findOfficeByName(String name);

    void saveOffice(Office office);

    void deleteOffice(Long id);

    List<Office> findAllOffices();

    List<Office> searchOffices(String toSearch);
    
}
