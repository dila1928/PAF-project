package com.campus.backend.moduleb.bookingmanagement.exception;

public class BookingForbiddenException extends RuntimeException {

    public BookingForbiddenException(String message) {
        super(message);
    }
}
