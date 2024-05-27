package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.dto.BranchDto;
import com.david.maman.courierserver.models.entities.Branch;

public interface BranchService {

    Optional<Branch> findBranchById(Long id);

    Optional<Branch> findBranchByCity(String city);

    Optional<Branch> findBranchByAddress(String address);

    Optional<Branch> findBranchByCityAndAddress(String city, String address);

    void saveBranch(Branch branch);

    BranchDto createBranch(BranchDto branchDto);

    BranchDto updateBranch(Long branchId, BranchDto branchDto);

    void deleteBranch(Long id);

    List<Branch> findAllBranches();

    List<BranchDto> getAllBranches();

    List<Branch> searchBranchesByCity(String city);
    List<Branch> searchBranchesByAddress(String address);

    List<BranchDto> searchBranches(String toSearch);

}
