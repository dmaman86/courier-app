package com.david.maman.courierserver.controllers;

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

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getBranchById(@PathVariable Long id){
        try{
            Branch branch = branchService.findBranchById(id).orElseThrow(
                () -> new Exception("Branch not found")
            );
            return ResponseEntity.ok(branch);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllBranches(){
        return ResponseEntity.ok(branchService.findAllBranches());
    }

    @PostMapping("/")
    public ResponseEntity<?> saveBranch(@RequestBody BranchDto branchDto){
        try{
            Optional<Branch> branchDb = branchService.findBranchByCityAndAddress(
                branchDto.getCity(),
                branchDto.getAddress());
            if(branchDb.isPresent()){
                throw new Exception("Branch already exists");
            }
            Branch branch = Branch.toEntity(branchDto);
            branchService.saveBranch(branch);
            return ResponseEntity.ok(branch);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updateBranch(@RequestBody Branch branch){
        try{
            Optional<Branch> branchDb = branchService.findBranchById(branch.getId());
            if(branchDb.isEmpty()){
                throw new Exception("Branch not found");
            }
            branchService.saveBranch(branch);
            return ResponseEntity.ok(branch);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id){
        try{
            Optional<Branch> branchDb = branchService.findBranchById(id);
            if(branchDb.isEmpty()){
                throw new Exception("Branch not found");
            }
            branchService.deleteBranch(id);
            return ResponseEntity.ok("Branch deleted");
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
