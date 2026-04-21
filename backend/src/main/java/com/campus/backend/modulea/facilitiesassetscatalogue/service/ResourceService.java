package com.campus.backend.modulea.facilitiesassetscatalogue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.backend.modulea.facilitiesassetscatalogue.dto.ResourceRequest;
import com.campus.backend.modulea.facilitiesassetscatalogue.dto.ResourceResponse;
import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceStatus;
import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceType;
import com.campus.backend.modulea.facilitiesassetscatalogue.exception.ResourceNotFoundException;
import com.campus.backend.modulea.facilitiesassetscatalogue.model.Resource;
import com.campus.backend.modulea.facilitiesassetscatalogue.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceResponse createResource(ResourceRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .status(request.getStatus())
                .description(request.getDescription())
                .build();

        Resource savedResource = resourceRepository.save(resource);
        return mapToResponse(savedResource);
    }

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ResourceResponse getResourceById(String id) {
        Resource resource = findByIdOrThrow(id);
        return mapToResponse(resource);
    }

    public ResourceResponse updateResource(String id, ResourceRequest request) {
        Resource existingResource = findByIdOrThrow(id);

        existingResource.setName(request.getName());
        existingResource.setType(request.getType());
        existingResource.setCapacity(request.getCapacity());
        existingResource.setLocation(request.getLocation());
        existingResource.setAvailableFrom(request.getAvailableFrom());
        existingResource.setAvailableTo(request.getAvailableTo());
        existingResource.setStatus(request.getStatus());
        existingResource.setDescription(request.getDescription());

        Resource updatedResource = resourceRepository.save(existingResource);
        return mapToResponse(updatedResource);
    }

    public void deleteResource(String id) {
        Resource resource = findByIdOrThrow(id);
        resourceRepository.delete(resource);
    }

    public List<ResourceResponse> searchResources(ResourceType type, ResourceStatus status, String location,
                                                  Integer minCapacity) {
        return resourceRepository.findAll()
                .stream()
                .filter(resource -> type == null || resource.getType() == type)
                .filter(resource -> status == null || resource.getStatus() == status)
                .filter(resource -> location == null || location.isBlank()
                        || (resource.getLocation() != null
                        && resource.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(resource -> minCapacity == null || (resource.getCapacity() != null
                        && resource.getCapacity() >= minCapacity))
                .map(this::mapToResponse)
                .toList();
    }

    private Resource findByIdOrThrow(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .build();
    }
}
