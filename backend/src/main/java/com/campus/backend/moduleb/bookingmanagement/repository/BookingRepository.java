package com.campus.backend.moduleb.bookingmanagement.repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.campus.backend.moduleb.bookingmanagement.enums.BookingStatus;
import com.campus.backend.moduleb.bookingmanagement.model.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByResourceIdAndBookingDateAndStatusIn(
            String resourceId,
            LocalDate bookingDate,
            Collection<BookingStatus> statuses);

    List<Booking> findByRequestedByUserIdOrderByBookingDateDescStartTimeDesc(String requestedByUserId);
}
