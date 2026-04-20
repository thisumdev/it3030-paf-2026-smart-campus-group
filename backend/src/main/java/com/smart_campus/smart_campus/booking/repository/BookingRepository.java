package com.smart_campus.smart_campus.booking.repository;

import com.smart_campus.smart_campus.booking.entity.Booking;
import com.smart_campus.smart_campus.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByResourceId(Long resourceId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.status = 'APPROVED' AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.status = 'APPROVED' AND b.startTime < :endTime AND b.endTime > :startTime AND b.id != :excludeId")
    List<Booking> findOverlappingBookingsExcluding(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId);

    @Query("SELECT b FROM Booking b WHERE b.status = 'APPROVED' AND b.reminderSent = false AND b.startTime BETWEEN :from AND :to")
    List<Booking> findBookingsForReminder(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("SELECT b FROM Booking b WHERE b.status = 'APPROVED' AND b.checkedInAt IS NULL AND b.startTime < :cutoff")
    List<Booking> findNoShowBookings(@Param("cutoff") LocalDateTime cutoff);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.endTime < :now ORDER BY b.endTime DESC")
    List<Booking> findPastBookingsByUserId(
            @Param("userId") Long userId,
            @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.startTime >= :from AND b.endTime <= :to")
    List<Booking> findByResourceIdAndDateRange(
            @Param("resourceId") Long resourceId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);
}
