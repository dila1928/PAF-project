package com.campus.backend.modulea.facilitiesassetscatalogue.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceId) {
        super("Resource not found with id: " + resourceId);
    }
}
