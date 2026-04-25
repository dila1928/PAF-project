package com.campus.backend.moduleb.bookingmanagement.model;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.campus.backend.moduleb.bookingmanagement.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String resourceId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;

    private String requestedByUserId;
    private BookingStatus status;

    /** Set when an admin rejects a request (required for REJECTED). */
    private String decisionReason;
    private String reviewedByUserId;
    private Instant reviewedAt;

    private Instant createdAt;
}
