package com.smart_campus.smart_campus.user.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "notification_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "email_alerts")
    private Boolean emailAlerts = true;

    @Column(name = "booking_updates")
    private Boolean bookingUpdates = true;

    @Column(name = "ticket_updates")
    private Boolean ticketUpdates = true;
}