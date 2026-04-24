package com.campus.backend.modulea.facilitiesassetscatalogue.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import com.campus.backend.moduleb.bookingmanagement.exception.BookingConflictException;
import com.campus.backend.moduleb.bookingmanagement.exception.BookingForbiddenException;
import com.campus.backend.moduleb.bookingmanagement.exception.BookingNotFoundException;
import com.campus.backend.moduleb.bookingmanagement.exception.InvalidBookingException;
import com.mongodb.MongoException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleBookingNotFound(BookingNotFoundException ex) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<Map<String, Object>> handleBookingConflict(BookingConflictException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(BookingForbiddenException.class)
    public ResponseEntity<Map<String, Object>> handleBookingForbidden(BookingForbiddenException ex) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(InvalidBookingException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidBooking(InvalidBookingException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String validationMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, validationMessage);
    }

    @ExceptionHandler(DataAccessResourceFailureException.class)
    public ResponseEntity<Map<String, Object>> handleDatabaseConnectivity(DataAccessResourceFailureException ex) {
        return buildErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Database is unavailable. Ensure MongoDB is running and spring.data.mongodb.uri is correct.");
    }

    @ExceptionHandler(MongoException.class)
    public ResponseEntity<Map<String, Object>> handleMongoException(MongoException ex) {
        return buildErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Could not connect to MongoDB. Check your MongoDB server and connection URI.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String message) {
        Map<String, Object> errorBody = new LinkedHashMap<>();
        errorBody.put("timestamp", Instant.now());
        errorBody.put("message", message);
        errorBody.put("status", status.value());
        return ResponseEntity.status(status).body(errorBody);
    }
}
