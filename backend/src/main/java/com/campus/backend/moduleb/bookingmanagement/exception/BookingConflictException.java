package com.campus.backend.moduleb.bookingmanagement.exception;

public class BookingConflictException extends RuntimeException {

    public BookingConflictException(String message) {
        super(message);
    }
}
