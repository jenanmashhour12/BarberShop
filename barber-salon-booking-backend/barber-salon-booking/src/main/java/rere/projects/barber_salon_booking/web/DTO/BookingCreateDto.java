package rere.projects.barber_salon_booking.web.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingCreateDto(
        Integer salonId,
        String customerName,
        String customerPhone,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String status,
        String notes,
        Integer customerId
) {}
