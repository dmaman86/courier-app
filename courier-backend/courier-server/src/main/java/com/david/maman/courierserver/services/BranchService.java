package com.david.maman.courierserver.services;

import java.util.List;
import java.util.Optional;

import com.david.maman.courierserver.models.entities.Branch;

public interface BranchService {

    Optional<Branch> findBranchById(Long id);

    Optional<Branch> findBranchByCity(String city);

    Optional<Branch> findBranchByAddress(String address);

    Optional<Branch> findBranchByCityAndAddress(String city, String address);

    void saveBranch(Branch branch);

    void deleteBranch(Long id);

    List<Branch> findAllBranches();

    List<Branch> searchBranches(String toSearch);

}
