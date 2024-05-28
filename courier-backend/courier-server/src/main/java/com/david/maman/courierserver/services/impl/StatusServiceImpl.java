package com.david.maman.courierserver.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.helpers.StateEnum;
import com.david.maman.courierserver.mappers.StatusMapper;
import com.david.maman.courierserver.models.dto.StatusDto;
import com.david.maman.courierserver.models.entities.Status;
import com.david.maman.courierserver.repositories.StatusRepository;
import com.david.maman.courierserver.services.StatusService;

@Service
public class StatusServiceImpl implements StatusService{

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private StatusMapper statusMapper;

    @Override
    @Transactional(readOnly = true)
    public StatusDto findStatusById(Long id){
        Status status = statusRepository.findById(id).orElseThrow(
            () -> new RuntimeException("Status not found")
        );
        return statusMapper.toDto(status);
    }

    @Transactional
    private Status save(Status status){
        return statusRepository.save(status);
    }

    @Override
    @Transactional
    public Status saveStatus(StatusDto statusDto){
        if(statusRepository.findByName(statusDto.getName()).isPresent()){
            throw new RuntimeException("Status already exists");
        }
        Status status = statusMapper.toEntity(statusDto);
        return this.save(status);
    }

    @Override
    @Transactional
    public Status updateStatus(StatusDto statusDto){
        if(statusRepository.findById(statusDto.getId()).isEmpty()){
            throw new RuntimeException("Status not found");
        }
        Status status = statusMapper.toEntity(statusDto);
        return this.save(status);
    }

    @Override
    @Transactional
    public void deleteStatus(Long id) {
        // TODO: check if status is used in Order
        statusRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatusDto> getAll() {
        List<Status> status = statusRepository.findAll();

        return status.stream().map(statusMapper::toDto).collect(Collectors.toList());
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
