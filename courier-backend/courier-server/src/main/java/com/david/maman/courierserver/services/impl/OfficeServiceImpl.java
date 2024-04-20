package com.david.maman.courierserver.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Office;
import com.david.maman.courierserver.repositories.BranchRepository;
import com.david.maman.courierserver.repositories.OfficeRepository;
import com.david.maman.courierserver.services.OfficeService;

@Service
public class OfficeServiceImpl implements OfficeService{

    @Autowired
    private OfficeRepository officeRepository;

    @Autowired
    private BranchRepository branchRepository;

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
    public void deleteOffice(Long id) {
        officeRepository.deleteById(id);
    }

    @Override
    public List<Office> findAllOffices() {
        return officeRepository.findAll();
    }

    @Override
    public List<Office> searchOffices(String toSearch) {
        return officeRepository.findByNameContaining(toSearch);
    }
}
