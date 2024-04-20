package com.david.maman.courierserver.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.repositories.BranchRepository;
import com.david.maman.courierserver.services.BranchService;

@Service
public class BranchServiceImpl implements BranchService{

    @Autowired
    private BranchRepository branchRepository;

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
    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }

    @Override
    public List<Branch> findAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public Optional<Branch> findBranchByCityAndAddress(String city, String address) {
        return branchRepository.findByCityAndAddress(city, address);
    }

    @Override
    public List<Branch> searchBranches(String toSearch) {
        List<Branch> branches = new ArrayList<>();

        branches.addAll(branchRepository.findByCityContaining(toSearch));
        branches.addAll(branchRepository.findByAddressContaining(toSearch));

        Set<Branch> uniBranches = new HashSet<>(branches);
        return new ArrayList<>(uniBranches);
    }

}
