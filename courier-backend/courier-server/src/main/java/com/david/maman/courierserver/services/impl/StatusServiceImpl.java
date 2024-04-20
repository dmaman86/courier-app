package com.david.maman.courierserver.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.helpers.StateEnum;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.repositories.StatusRepository;
import com.david.maman.courierserver.services.StatusService;

@Service
public class StatusServiceImpl implements StatusService{

    @Autowired
    private StatusRepository statusRepository;

    @Override
    public Optional<Status> findStatusById(Long id) {
       return statusRepository.findById(id);
    }

    @Override
    public void saveStatus(Status status) {
        statusRepository.save(status);
    }

    @Override
    public void deleteStatus(Long id) {
        statusRepository.deleteById(id);
    }

    @Override
    public List<Status> getAll() {
        return statusRepository.findAll();
    }

    @Override
    public Optional<Status> findStatusByName(String name) {
        return statusRepository.findByName(name);
    }

    @Override
    public List<Status> getFinishProccess(){
        StateEnum cancelled = StateEnum.CANCELED;
        StateEnum denied = StateEnum.DENIED;
        StateEnum delivered = StateEnum.DELIVERED;
        StateEnum returned = StateEnum.RETURNED;

        return statusRepository.findAllById(
            List.of(cancelled.getId(), 
                    denied.getId(), 
                    delivered.getId(), 
                    returned.getId()));
    }

    @Override
    public List<Status> getInProcess(){
        StateEnum accepted = StateEnum.ACCEPTED;
        StateEnum taken = StateEnum.TAKEN;
        StateEnum pending = StateEnum.PENDING;
        StateEnum pendingTaken = StateEnum.PENDING_TAKEN;
        StateEnum undelivered = StateEnum.UNDELIVERED;
        StateEnum requiredToReturn = StateEnum.REQUIRED_TO_RETURN;

        return statusRepository.findAllById(
            List.of(accepted.getId(), 
                    taken.getId(), 
                    pending.getId(), 
                    pendingTaken.getId(), 
                    undelivered.getId(), 
                    requiredToReturn.getId()));
        
    }

}
