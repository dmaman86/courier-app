package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.dto.StatusDto;
import com.david.maman.courierserver.models.entities.Status;

public interface StatusService {

    // Optional<Status> findStatusById(Long id);

    StatusDto findStatusById(Long id);

    Optional<Status> findStatusByName(String name);

    // void saveStatus(Status status);

    Status saveStatus(StatusDto statusDto);

    Status updateStatus(StatusDto statusDto);

    void deleteStatus(Long id);

    List<StatusDto> getAll();

    List<Status> getFinishProccess();

    List<Status> getInProcess();
}
