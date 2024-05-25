package com.david.maman.courierserver.controllers;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/")
    public ResponseEntity<?> getAllBranches(){
        List<BranchDto> branchesDto = branchService.getAllBranches();
        logger.info("list branchesDto: {}", branchesDto);
        return ResponseEntity.ok(branchesDto);
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

}
