package com.courier.resourceservice.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.courier.resourceservice.manager.BranchManager;
import com.courier.resourceservice.objects.criteria.BranchCriteria;
import com.courier.resourceservice.objects.dto.BranchBaseDto;
import com.courier.resourceservice.objects.dto.BranchDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.mapper.BranchMapper;
import com.courier.resourceservice.objects.request.BranchSearchRequest;
import com.courier.resourceservice.repository.BranchRepository;
import com.courier.resourceservice.service.BranchService;

@Service
public class BranchServiceImpl implements BranchService {

  private final BranchManager branchManager;
  private final BranchMapper branchMapper;
  private final BranchRepository branchRepository;

  public BranchServiceImpl(
      BranchManager branchManager, BranchMapper branchMapper, BranchRepository branchRepository) {
    this.branchManager = branchManager;
    this.branchMapper = branchMapper;
    this.branchRepository = branchRepository;
  }

  @Override
  public Page<BranchDto> getBranches(Pageable pageable) {
    return branchRepository.findByEnabledTrue(pageable).map(branchMapper::toDto);
  }

  @Override
  public Page<BranchDto> getBranchesByOfficeId(Long officeId, Pageable pageable) {
    return branchRepository
        .findByEnabledTrueAndOfficeId(officeId, pageable)
        .map(branchMapper::toDto);
  }

  @Override
  public Page<BranchDto> getBranchesByContactId(Long contactId, Pageable pageable) {
    return branchRepository
        .findByContactsIdAndEnabledTrue(contactId, pageable)
        .map(branchMapper::toDto);
  }

  @Override
  public List<BranchBaseDto> getBranchesWithoutPagination() {
    var branches = branchRepository.findByEnabledTrue();
    return branchMapper.toBaseDtoList(branches);
  }

  @Override
  public List<BranchBaseDto> getBranchesByOfficeId(Long officeId) {
    var branches = branchRepository.findByEnabledTrueAndOfficeId(officeId);
    return branchMapper.toBaseDtoList(branches);
  }

  @Override
  public Set<String> getBranchCities() {
    List<Branch> branches = branchRepository.findByEnabledTrue();

    return branches.stream()
        .map(Branch::getCity)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet());
  }

  @Override
  public BranchDto getBranchById(Long id) {
    return branchRepository
        .findById(id)
        .filter(Branch::isEnabled)
        .map(branchMapper::toDto)
        .orElseThrow(() -> new IllegalArgumentException("Branch not found"));
  }

  @Override
  public BranchDto createBranch(BranchDto branchDto) {
    return branchMapper.toDto(branchManager.createBranch(branchDto));
  }

  @Override
  public BranchDto updateBranch(Long id, BranchDto branchDto) {
    return branchMapper.toDto(branchManager.updateBranch(id, branchDto));
  }

  @Override
  public void disabledBranch(Long id) {
    branchManager.disableBranch(id);
  }

  @Override
  public Page<BranchDto> searchBranches(String searchQuery, Pageable pageable) {
    if (searchQuery == null || searchQuery.trim().isEmpty()) {
      return Page.empty();
    }

    Specification<Branch> spec = BranchCriteria.containsText(searchQuery);
    Page<Branch> branches = branchRepository.findAll(spec, pageable);

    return branches.map(branchMapper::toDto);
  }

  @Override
  public Page<BranchDto> searchAdvancedBranches(BranchSearchRequest request, Pageable pageable) {
    Specification<Branch> spec = BranchCriteria.advancedSearch(request);
    Page<Branch> branches = branchRepository.findAll(spec, pageable);

    return branches.map(branchMapper::toDto);
  }
}
