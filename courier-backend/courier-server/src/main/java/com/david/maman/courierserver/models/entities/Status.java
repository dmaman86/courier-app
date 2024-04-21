package com.david.maman.courierserver.models.entities;

import java.util.ArrayList;
import java.util.List;

import com.david.maman.courierserver.models.dto.StatusDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "status")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public static Status toEntity(StatusDto statusDto){
        return Status.builder()
                .id(statusDto.getId())
                .name(statusDto.getName())
                .build();
    }

    public static List<Status> toEntity(List<StatusDto> statusDtos){
        List<Status> statuses = new ArrayList<>();
        statusDtos.forEach(statusDto -> statuses.add(Status.toEntity(statusDto)));

        return statuses;
    }
}
