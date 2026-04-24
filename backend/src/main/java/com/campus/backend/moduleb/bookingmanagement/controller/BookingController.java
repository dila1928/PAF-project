package com.campus.backend.moduleb.bookingmanagement.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.backend.moduleb.bookingmanagement.dto.BookingResponse;
import com.campus.backend.moduleb.bookingmanagement.dto.CreateBookingRequest;
import com.campus.backend.moduleb.bookingmanagement.dto.RejectBookingRequest;
import com.campus.backend.moduleb.bookingmanagement.enums.BookingStatus;
import com.campus.backend.moduleb.bookingmanagement.exception.BookingForbiddenException;
import com.campus.backend.moduleb.bookingmanagement.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    static final String HEADER_USER_ID = "X-User-Id";
    static final String HEADER_USER_ROLE = "X-User-Role";

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestHeader(value = HEADER_USER_ID, defaultValue = "demo-user") String userId,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse created = bookingService.createBooking(userId, request);
        URI location = URI.create("/api/bookings/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @RequestHeader(value = HEADER_USER_ID, defaultValue = "demo-user") String userId) {
        return ResponseEntity.ok(bookingService.listMine(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> listAllBookings(
            @RequestHeader(value = HEADER_USER_ROLE, defaultValue = "USER") String role,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) java.time.LocalDate fromDate,
            @RequestParam(required = false) java.time.LocalDate toDate) {
        requireAdmin(role);
        return ResponseEntity.ok(bookingService.listAllForAdmin(
                status, resourceId, userId, fromDate, toDate));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approve(
            @PathVariable String id,
            @RequestHeader(value = HEADER_USER_ID, defaultValue = "admin") String adminUserId,
            @RequestHeader(value = HEADER_USER_ROLE, defaultValue = "USER") String role) {
        requireAdmin(role);
        return ResponseEntity.ok(bookingService.approve(id, adminUserId));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> reject(
            @PathVariable String id,
            @RequestHeader(value = HEADER_USER_ID, defaultValue = "admin") String adminUserId,
            @RequestHeader(value = HEADER_USER_ROLE, defaultValue = "USER") String role,
            @Valid @RequestBody RejectBookingRequest body) {
        requireAdmin(role);
        return ResponseEntity.ok(bookingService.reject(id, adminUserId, body.getReason()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(
            @PathVariable String id,
            @RequestHeader(value = HEADER_USER_ID, defaultValue = "demo-user") String userId,
            @RequestHeader(value = HEADER_USER_ROLE, defaultValue = "USER") String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(bookingService.cancelAsAdmin(id, userId));
        }
        return ResponseEntity.ok(bookingService.cancelAsUser(id, userId));
    }

    private static void requireAdmin(String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new BookingForbiddenException("Admin role required for this operation.");
        }
    }
}
