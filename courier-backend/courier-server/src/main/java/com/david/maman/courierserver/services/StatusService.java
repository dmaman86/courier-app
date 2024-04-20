package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.entities.Status;

public interface StatusService {

    Optional<Status> findStatusById(Long id);

    Optional<Status> findStatusByName(String name);

    void saveStatus(Status status);

    void deleteStatus(Long id);

    List<Status> getAll();

    List<Status> getFinishProccess();

    List<Status> getInProcess();
}
