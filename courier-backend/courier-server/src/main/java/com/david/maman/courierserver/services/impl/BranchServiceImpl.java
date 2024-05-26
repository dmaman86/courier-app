package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.david.maman.courierserver.mappers.BranchMapper;
import com.david.maman.courierserver.models.dto.BranchDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.repositories.BranchRepository;
import com.david.maman.courierserver.repositories.OfficeRepository;
import com.david.maman.courierserver.services.BranchService;

@Service
public class BranchServiceImpl implements BranchService{

    private static final Logger logger = LoggerFactory.getLogger(BranchServiceImpl.class);

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private OfficeRepository officeRepository;

    @Autowired
    private BranchMapper branchMapper;

    @Override
    public Optional<Branch> findBranchById(Long id) {
        return branchRepository.findById(id);
    }

    @Override
    public Optional<Branch> findBranchByCity(String city) {
        return branchRepository.findByCity(city);
    }

    @Override
    public Optional<Branch> findBranchByAddress(String address) {
        return branchRepository.findByAddress(address);
    }

    @Override
    public void saveBranch(Branch branch) {
        branchRepository.save(branch);
    }

    @Override
    @Transactional
    public BranchDto createBranch(BranchDto branchDto){
        Office office = officeRepository.findById(branchDto.getOffice().getId()).orElseThrow(
            () -> new ResourceNotFoundException("Office not found")
        );
        Branch branch = branchMapper.toEntity(branchDto, office);
        branch = branchRepository.save(branch);
        return branchMapper.toDto(branch);
    }

    @Override
    @Transactional
    public BranchDto updateBranch(Long branchId, BranchDto branchDto){
        Branch existingBranch = branchRepository.findById(branchId).orElseThrow(
            () -> new ResourceNotFoundException("Branch not found")
        );

        Office office = officeRepository.findById(branchDto.getOffice().getId()).orElseThrow(
            () -> new ResourceNotFoundException("Office not found")
        );
        existingBranch.setCity(branchDto.getCity());
        existingBranch.setAddress(branchDto.getAddress());
        existingBranch.setOffice(office);

        Branch updatedBranch = branchRepository.save(existingBranch);
        return branchMapper.toDto(updatedBranch);
    }

    @Override
    @Transactional
    public void deleteBranch(Long id) {
        // branchRepository.deleteById(id);
        Branch branch = branchRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Branch not found")
        );
        Office office = branch.getOffice();
        if(branchRepository.countByOffice(office) == 1)
            throw new IllegalStateException("Cannot delete the only branch of an office");

        branchRepository.delete(branch);
    }

    @Override
    public List<Branch> findAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public List<BranchDto> getAllBranches(){
        List<Branch> branches = branchRepository.findAll();
        logger.info("find list branches: {}", branches);
        // return branchMapper.toDto(branches);
        return branches.stream().map(branchMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public Optional<Branch> findBranchByCityAndAddress(String city, String address) {
        return branchRepository.findByCityAndAddress(city, address);
    }

    @Override
    public List<BranchDto> searchBranches(String toSearch) {
        List<Branch> branches = new ArrayList<>();

        branches.addAll(branchRepository.findByCityContainingIgnoreCase(toSearch));
        branches.addAll(branchRepository.findByAddressContainingIgnoreCase(toSearch));

        Set<Branch> uniBranches = new HashSet<>(branches);
        // return new ArrayList<>(uniBranches);
        return uniBranches.stream().map(branchMapper::toDto).collect(Collectors.toList());
    }

}
