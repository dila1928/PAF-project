package com.campus.backend.modulea.facilitiesassetscatalogue.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceStatus;
import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceType;
import com.campus.backend.modulea.facilitiesassetscatalogue.model.Resource;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
}
