package com.campus.backend.moduleb.bookingmanagement.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import com.campus.backend.moduleb.bookingmanagement.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private String id;
    private String resourceId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private String requestedByUserId;
    private BookingStatus status;
    private String decisionReason;
    private String reviewedByUserId;
    private Instant reviewedAt;
    private Instant createdAt;
}
