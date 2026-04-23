package com.smart_campus.smart_campus.booking.scheduler;

import com.smart_campus.smart_campus.booking.entity.Booking;
import com.smart_campus.smart_campus.booking.entity.BookingStatus;
import com.smart_campus.smart_campus.booking.repository.BookingRepository;
import com.smart_campus.smart_campus.notifications.entity.Notification.NotificationType;
import com.smart_campus.smart_campus.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class BookingScheduler {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedDelay = 60000)
    public void autoMarkNoShows() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<Booking> noShows = bookingRepository.findNoShowBookings(cutoff);
        for (Booking booking : noShows) {
            booking.setStatus(BookingStatus.PENDING_REVIEW);
            bookingRepository.save(booking);

            notificationService.notify(
                    booking.getUser().getId(),
                    NotificationType.BOOKING_CANCELLED,
                    "Your booking for " + booking.getResource().getName() + " on " +
                            booking.getStartTime().toLocalDate() +
                            " was not checked in and has been flagged for review.",
                    booking.getId(),
                    "BOOKING"
            );
        }
    }

    @Scheduled(fixedDelay = 300000)
    public void sendBookingReminders() {
        LocalDateTime from = LocalDateTime.now().plusMinutes(25);
        LocalDateTime to   = LocalDateTime.now().plusMinutes(35);
        List<Booking> upcoming = bookingRepository.findBookingsForReminder(from, to);
        for (Booking booking : upcoming) {
            notificationService.notify(
                    booking.getUser().getId(),
                    NotificationType.BOOKING_APPROVED,
                    "Reminder: Your booking for " + booking.getResource().getName() +
                            " starts in 30 minutes at " +
                            booking.getStartTime().toLocalTime().withSecond(0).withNano(0) +
                            ". Don't forget to check in when you arrive.",
                    booking.getId(),
                    "BOOKING"
            );
            booking.setReminderSent(true);
            bookingRepository.save(booking);
        }
    }
}
