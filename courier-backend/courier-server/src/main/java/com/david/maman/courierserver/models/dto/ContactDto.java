package com.david.maman.courierserver.models.dto;

import java.util.List;

import com.david.maman.courierserver.models.dto.base.BranchInfoDto;
import com.david.maman.courierserver.models.dto.base.OfficeInfoDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactDto {

    private Long id;
    private String name;
    private String lastName;
    private String phone;

    private OfficeInfoDto office;

    private List<BranchInfoDto> branches;

}
