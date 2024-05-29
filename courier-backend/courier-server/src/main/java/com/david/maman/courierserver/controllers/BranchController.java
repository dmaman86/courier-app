package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.david.maman.courierserver.mappers.BranchMapper;
import com.david.maman.courierserver.models.dto.BranchDto;
import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.services.BranchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courier/branch")
@RequiredArgsConstructor
public class BranchController {

    private static Logger logger = LoggerFactory.getLogger(BranchController.class);

    private final BranchService branchService;

    private final BranchMapper branchMapper;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getBranchById(@PathVariable Long id){
        try{
            Branch branch = branchService.findBranchById(id).orElseThrow(
                () -> new Exception("Branch not found")
            );
            logger.info("find branch: {}", branch);
            BranchDto branchDto = branchMapper.toDto(branch);
            return ResponseEntity.ok(branchDto);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllBranches(){
        List<BranchDto> branchesDto = branchService.getAllBranches();
        return ResponseEntity.ok(branchesDto);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllBranches(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){
        // List<BranchDto> branchesDto = branchService.getAllBranches();
        // logger.info("list branchesDto: {}", branchesDto);
        Pageable pageable = PageRequest.of(page, size);
        Page<Branch> branchesPage = branchService.findAllBranches(pageable);
        List<BranchDto> branchesDto = branchesPage.getContent().stream().map(branchMapper::toDto).collect(Collectors.toList());
        Page<BranchDto> branchesDtoPage = new PageImpl<>(branchesDto, pageable, branchesPage.getTotalElements());

        return ResponseEntity.ok(branchesDtoPage);
    }

    @PostMapping("/")
    public ResponseEntity<?> saveBranch(@RequestBody BranchDto branchDto){
        BranchDto createdBranch = branchService.createBranch(branchDto);
        return ResponseEntity.ok(createdBranch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBranch(@PathVariable Long id, @RequestBody BranchDto branchDto){
        BranchDto updatedBranch = branchService.updateBranch(id, branchDto);
        return ResponseEntity.ok(updatedBranch);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id){
        branchService.deleteBranch(id);
        return ResponseEntity.ok("Branch deleted");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBranches(@RequestParam("query") String query,
                                            @RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "10") int size){
        Page<Branch> branchesPage = branchService.searchBranches(query, page, size);
        List<BranchDto> branchesDto = branchesPage.getContent().stream().map(branchMapper::toDto).collect(Collectors.toList());
        Page<BranchDto> branchesDtoPage = new PageImpl<>(branchesDto, PageRequest.of(page, size), branchesPage.getTotalElements());
        
        return ResponseEntity.ok(branchesDtoPage);
    }

}
