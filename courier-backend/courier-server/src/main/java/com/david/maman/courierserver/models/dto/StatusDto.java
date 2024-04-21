package com.david.maman.courierserver.models.dto;


import java.util.ArrayList;
import java.util.List;

import com.david.maman.courierserver.models.entities.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusDto {

    private Long id;
    private String name;

    public static StatusDto toDto(Status status){
        return StatusDto.builder()
                .id(status.getId())
                .name(status.getName())
                .build();
    }

    public static List<StatusDto> toDto(List<Status> statuses){
        List<StatusDto> statusDtosList = new ArrayList<>();
        statuses.forEach(status -> statusDtosList.add(StatusDto.toDto(status)));

        return statusDtosList;
    }
}
