package com.david.maman.courierserver.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.mappers.OfficeMapper;
import com.david.maman.courierserver.models.dto.OfficeDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.repositories.BranchRepository;
import com.david.maman.courierserver.repositories.ContactRepository;
import com.david.maman.courierserver.repositories.OfficeRepository;
import com.david.maman.courierserver.services.OfficeService;

@Service
public class OfficeServiceImpl implements OfficeService{

    private static final Logger logger = LoggerFactory.getLogger(OfficeServiceImpl.class);

    @Autowired
    private OfficeRepository officeRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private OfficeMapper officeMapper;

    @Override
    public Optional<Office> findOfficeById(Long id) {
        return officeRepository.findById(id);
    }

    @Override
    public Optional<Office> findOfficeByName(String name) {
        return officeRepository.findByName(name);
    }

    @Override
    public void saveOffice(Office office) {
        officeRepository.save(office);
        for(Branch branch : office.getBranches()){
            branch.setOffice(office);
            branchRepository.save(branch);
        }
    }

    @Override
    @Transactional
    public OfficeDto createOffice(OfficeDto officeDto){
        if(officeDto.getBranches().isEmpty())
            throw new IllegalArgumentException("Office must have a least one branch");

        Office office = officeMapper.toEntity(officeDto);
        Office savedOffice = officeRepository.save(office);

        List<Branch> branches = officeDto.getBranches().stream()
                                        .map(branchInfoDto -> {
                                            Branch branch = Branch.builder()
                                                                .city(branchInfoDto.getCity())
                                                                .address(branchInfoDto.getAddress())
                                                                .office(savedOffice)
                                                                .build();
                                            return branchRepository.save(branch);
                                        })
                                        .collect(Collectors.toList());
        savedOffice.setBranches(branches);
        return officeMapper.toDto(savedOffice);
    }

    @Override
    @Transactional
    public OfficeDto updateOffice(Long officeId, OfficeDto officeDto){
        Office existingOffice = officeRepository.findById(officeId).orElseThrow(
            () -> new ResourceNotFoundException("Office not found")
        );
        if(officeDto.getBranches().isEmpty())
            throw new IllegalArgumentException("Office must have at least one branch");

        existingOffice.setName(officeDto.getName());

        List<Branch> branchesToRemove = existingOffice.getBranches().stream()
                                            .filter(branch -> officeDto.getBranches().stream()
                                                        .noneMatch(dto -> dto.getId().equals(branch.getId())))
                                            .collect(Collectors.toList());
        for(Branch branch : branchesToRemove){
            if(branchRepository.countByOffice(existingOffice) > 1)
                branchRepository.delete(branch);
            else
                throw new IllegalArgumentException("Cannot delete the only branch of an office");
        }

        List<Branch> updatedBranches = officeDto.getBranches().stream().map(branchInfoDto -> {
                                                    Branch branch;
                                                    if(branchInfoDto.getId() != null){
                                                        branch = branchRepository.findById(branchInfoDto.getId()).orElseThrow(
                                                            () -> new ResourceNotFoundException("Branch not found")
                                                        );
                                                        branch.setCity(branchInfoDto.getCity());
                                                        branch.setAddress(branchInfoDto.getAddress());
                                                    }else{
                                                        branch = Branch.builder()
                                                                        .city(branchInfoDto.getCity())
                                                                        .address(branchInfoDto.getAddress())
                                                                        .office(existingOffice)
                                                                        .build();
                                                    }
                                                    return branchRepository.save(branch);
                                                })
                                                .collect(Collectors.toList());
        existingOffice.setBranches(updatedBranches);
        Office updatedOffice = officeRepository.save(existingOffice);
        return officeMapper.toDto(updatedOffice);
    }

    @Override
    @Transactional
    public void deleteOffice(Long id) {
        // officeRepository.deleteById(id);
        Office office = officeRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Office not found")
        );
        if(contactRepository.existsByOffice(office))
            throw new IllegalStateException("Cannot delete office as it is associated with one or more contacts");
            
        officeRepository.delete(office);
    }

    @Override
    public List<Office> findAllOffices() {
        return officeRepository.findAll();
    }

    @Override
    public List<OfficeDto> getAllOffices(){
        List<Office> offices = officeRepository.findAll();
        logger.info("list office: {}", offices);
        // return officeMapper.toDto(offices);
        return offices.stream().map(officeMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<Office> searchOffices(String toSearch) {
        return officeRepository.findByNameContaining(toSearch);
    }
}
