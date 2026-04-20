package com.campus.backend.modulea.facilitiesassetscatalogue.dto;

import java.time.LocalTime;

import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceStatus;
import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Available from time is required")
    private LocalTime availableFrom;

    @NotNull(message = "Available to time is required")
    private LocalTime availableTo;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private String description;
}
