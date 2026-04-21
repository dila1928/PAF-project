package com.campus.backend.modulea.facilitiesassetscatalogue.dto;

import java.time.LocalTime;

import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceStatus;
import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

    private String id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String description;
}
