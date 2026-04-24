package com.campus.backend.moduleb.bookingmanagement.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.backend.modulea.facilitiesassetscatalogue.enums.ResourceStatus;
import com.campus.backend.modulea.facilitiesassetscatalogue.model.Resource;
import com.campus.backend.modulea.facilitiesassetscatalogue.service.ResourceService;
import com.campus.backend.moduleb.bookingmanagement.dto.BookingResponse;
import com.campus.backend.moduleb.bookingmanagement.dto.CreateBookingRequest;
import com.campus.backend.moduleb.bookingmanagement.enums.BookingStatus;
import com.campus.backend.moduleb.bookingmanagement.exception.BookingConflictException;
import com.campus.backend.moduleb.bookingmanagement.exception.BookingForbiddenException;
import com.campus.backend.moduleb.bookingmanagement.exception.BookingNotFoundException;
import com.campus.backend.moduleb.bookingmanagement.exception.InvalidBookingException;
import com.campus.backend.moduleb.bookingmanagement.model.Booking;
import com.campus.backend.moduleb.bookingmanagement.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final EnumSet<BookingStatus> BLOCKING_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    private final BookingRepository bookingRepository;
    private final ResourceService resourceService;

    public BookingResponse createBooking(String userId, CreateBookingRequest request) {
        Resource resource = resourceService.getResourceEntityById(request.getResourceId());
        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new InvalidBookingException("Resource is not available for booking (not ACTIVE).");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidBookingException("End time must be after start time.");
        }

        if (request.getStartTime().isBefore(resource.getAvailableFrom())
                || request.getEndTime().isAfter(resource.getAvailableTo())) {
            throw new InvalidBookingException(
                    "Booking must fall within the resource availability window.");
        }

        assertNoOverlap(
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                null);

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose().trim())
                .expectedAttendees(request.getExpectedAttendees())
                .requestedByUserId(userId)
                .status(BookingStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        return map(bookingRepository.save(booking));
    }

    public List<BookingResponse> listMine(String userId) {
        return bookingRepository
                .findByRequestedByUserIdOrderByBookingDateDescStartTimeDesc(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<BookingResponse> listAllForAdmin(
            BookingStatus status,
            String resourceId,
            String requestedByUserId,
            LocalDate fromDate,
            LocalDate toDate) {
        return bookingRepository.findAll().stream()
                .filter(b -> status == null || b.getStatus() == status)
                .filter(b -> resourceId == null
                        || resourceId.isBlank()
                        || resourceId.equals(b.getResourceId()))
                .filter(b -> requestedByUserId == null
                        || requestedByUserId.isBlank()
                        || requestedByUserId.equals(b.getRequestedByUserId()))
                .filter(b -> fromDate == null || !b.getBookingDate().isBefore(fromDate))
                .filter(b -> toDate == null || !b.getBookingDate().isAfter(toDate))
                .sorted(Comparator
                        .comparing(Booking::getBookingDate, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(
                                Booking::getStartTime,
                                Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::map)
                .toList();
    }

    public BookingResponse approve(String bookingId, String adminUserId) {
        Booking booking = findById(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingException("Only PENDING bookings can be approved.");
        }
        assertNoOverlap(
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getId());

        booking.setStatus(BookingStatus.APPROVED);
        booking.setReviewedByUserId(adminUserId);
        booking.setReviewedAt(Instant.now());
        booking.setDecisionReason(null);
        return map(bookingRepository.save(booking));
    }

    public BookingResponse reject(String bookingId, String adminUserId, String reason) {
        Booking booking = findById(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingException("Only PENDING bookings can be rejected.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setDecisionReason(reason.trim());
        booking.setReviewedByUserId(adminUserId);
        booking.setReviewedAt(Instant.now());
        return map(bookingRepository.save(booking));
    }

    public BookingResponse cancelAsUser(String bookingId, String userId) {
        Booking booking = findById(bookingId);
        if (!userId.equals(booking.getRequestedByUserId())) {
            throw new BookingForbiddenException("You can only cancel your own bookings.");
        }
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new InvalidBookingException("Only APPROVED bookings can be cancelled.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setReviewedAt(Instant.now());
        return map(bookingRepository.save(booking));
    }

    public BookingResponse cancelAsAdmin(String bookingId, String adminUserId) {
        Booking booking = findById(bookingId);
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new InvalidBookingException("Only APPROVED bookings can be cancelled.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setReviewedByUserId(adminUserId);
        booking.setReviewedAt(Instant.now());
        return map(bookingRepository.save(booking));
    }

    private void assertNoOverlap(
            String resourceId,
            LocalDate date,
            java.time.LocalTime start,
            java.time.LocalTime end,
            String excludeBookingId) {
        List<Booking> existing = bookingRepository.findByResourceIdAndBookingDateAndStatusIn(
                resourceId, date, BLOCKING_STATUSES);
        for (Booking b : existing) {
            if (excludeBookingId != null && excludeBookingId.equals(b.getId())) {
                continue;
            }
            if (timesOverlap(start, end, b.getStartTime(), b.getEndTime())) {
                throw new BookingConflictException(
                        "This resource is already booked for an overlapping time on that date.");
            }
        }
    }

    private static boolean timesOverlap(
            java.time.LocalTime aStart,
            java.time.LocalTime aEnd,
            java.time.LocalTime bStart,
            java.time.LocalTime bEnd) {
        return aStart.isBefore(bEnd) && aEnd.isAfter(bStart);
    }

    private Booking findById(String id) {
        return bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));
    }

    private BookingResponse map(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .resourceId(b.getResourceId())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .expectedAttendees(b.getExpectedAttendees())
                .requestedByUserId(b.getRequestedByUserId())
                .status(b.getStatus())
                .decisionReason(b.getDecisionReason())
                .reviewedByUserId(b.getReviewedByUserId())
                .reviewedAt(b.getReviewedAt())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
