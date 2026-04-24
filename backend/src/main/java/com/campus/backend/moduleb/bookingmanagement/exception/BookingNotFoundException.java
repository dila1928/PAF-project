package com.campus.backend.moduleb.bookingmanagement.exception;

public class BookingNotFoundException extends RuntimeException {

    public BookingNotFoundException(String id) {
        super("Booking not found: " + id);
    }
}
