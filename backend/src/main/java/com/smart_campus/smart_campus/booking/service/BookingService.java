package com.smart_campus.smart_campus.booking.service;

import com.smart_campus.smart_campus.booking.dto.BookingRequestDTO;
import com.smart_campus.smart_campus.booking.dto.BookingResponseDTO;
import com.smart_campus.smart_campus.booking.entity.Booking;
import com.smart_campus.smart_campus.booking.entity.BookingStatus;
import com.smart_campus.smart_campus.booking.exception.BookingConflictException;
import com.smart_campus.smart_campus.booking.exception.BookingNotAuthorizedException;
import com.smart_campus.smart_campus.booking.exception.BookingNotFoundException;
import com.smart_campus.smart_campus.booking.repository.BookingRepository;
import com.smart_campus.smart_campus.facility.entity.Resource;
import com.smart_campus.smart_campus.facility.repository.ResourceRepository;
import com.smart_campus.smart_campus.user.entity.User;
import com.smart_campus.smart_campus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                dto.getResourceId(), dto.getStartTime(), dto.getEndTime());

        if (!conflicts.isEmpty()) {
            Booking conflicting = conflicts.get(0);
            throw new BookingConflictException(
                    conflicting.getStartTime().toString(),
                    conflicting.getEndTime().toString());
        }

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .attendees(dto.getAttendees())
                .status(BookingStatus.PENDING)
                .checkInToken(UUID.randomUUID().toString())
                .build();

        Booking saved = bookingRepository.save(booking);
        return BookingResponseDTO.fromEntity(saved);
    }

    public BookingResponseDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        return BookingResponseDTO.fromEntity(booking);
    }

    public List<BookingResponseDTO> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO approveBooking(Long bookingId, Long adminUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        return BookingResponseDTO.fromEntity(bookingRepository.save(booking));
    }

    public BookingResponseDTO rejectBooking(Long bookingId, Long adminUserId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        return BookingResponseDTO.fromEntity(bookingRepository.save(booking));
    }

    public BookingResponseDTO cancelBooking(Long bookingId, Long requestingUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        User requestingUser = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = booking.getUser().getId().equals(requestingUserId);
        boolean isAdmin = requestingUser.getRole() == User.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new BookingNotAuthorizedException();
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return BookingResponseDTO.fromEntity(bookingRepository.save(booking));
    }

    public BookingResponseDTO checkIn(String token) {
        Booking booking = bookingRepository.findByCheckInToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid check-in token"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Booking is not approved");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = booking.getStartTime().plusMinutes(15);

        if (now.isBefore(booking.getStartTime()) || now.isAfter(windowEnd)) {
            throw new IllegalStateException("Check-in window has expired or not yet open");
        }

        booking.setCheckedInAt(now);
        return BookingResponseDTO.fromEntity(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getBookingHistory(Long userId) {
        return bookingRepository.findPastBookingsByUserId(userId, LocalDateTime.now()).stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
