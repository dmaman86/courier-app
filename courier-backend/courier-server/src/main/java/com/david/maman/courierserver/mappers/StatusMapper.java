package com.david.maman.courierserver.mappers;

import org.springframework.stereotype.Component;

import com.david.maman.courierserver.models.dto.StatusDto;
import com.david.maman.courierserver.models.entities.Status;

@Component
public class StatusMapper {

    public Status toEntity(StatusDto statusDto){
        if(statusDto == null)
            return null;

        return Status.builder()
                    .id(statusDto.getId())
                    .name(statusDto.getName())
                    .build();
    }

    public StatusDto toDto(Status status){
        if(status == null)
            return null;
            
        return StatusDto.builder()
                        .id(status.getId())
                        .name(status.getName())
                        .build();
    }

}
