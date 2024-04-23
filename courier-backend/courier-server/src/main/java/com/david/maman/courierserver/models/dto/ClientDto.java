package com.david.maman.courierserver.models.dto;

import java.util.List;


public class ClientDto extends UserDto{

    private OfficeDto office;
    private List<BranchDto> branches;

    
    public OfficeDto getOffice() {
        return office;
    }

    public void setOffice(OfficeDto office) {
        this.office = office;
    }

    public List<BranchDto> getBranches() {
        return branches;
    }

    public void setBranches(List<BranchDto> branches) {
        this.branches = branches;
    }

    @Override
    public String toString() {
        return "ClientDto [office=" + office + ", branches=" + branches + "]";
    }
}
