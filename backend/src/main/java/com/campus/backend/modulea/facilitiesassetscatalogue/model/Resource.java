package com.campus.backend.modulea.facilitiesassetscatalogue.model;

import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
@Document(collection = "resources")
public class Resource {

    @Id
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
