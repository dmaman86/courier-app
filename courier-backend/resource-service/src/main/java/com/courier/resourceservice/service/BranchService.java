package com.courier.resourceservice.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.courier.resourceservice.objects.dto.BranchBaseDto;
import com.courier.resourceservice.objects.dto.BranchDto;
import com.courier.resourceservice.objects.request.BranchSearchRequest;

public interface BranchService {

  Page<BranchDto> getBranches(Pageable pageable);

  Page<BranchDto> getBranchesByOfficeId(Long officeId, Pageable pageable);

  Page<BranchDto> getBranchesByContactId(Long contactId, Pageable pageable);

  List<BranchBaseDto> getBranchesWithoutPagination();

  List<BranchBaseDto> getBranchesByOfficeId(Long officeId);

  Set<String> getBranchCities();

  BranchDto getBranchById(Long id);

  BranchDto createBranch(BranchDto branchDto);

  BranchDto updateBranch(Long id, BranchDto branchDto);

  void disabledBranch(Long id);

  Page<BranchDto> searchBranches(String searchQuery, Pageable pageable);

  Page<BranchDto> searchAdvancedBranches(BranchSearchRequest request, Pageable pageable);
}
