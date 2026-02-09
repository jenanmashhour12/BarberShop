package rere.projects.barber_salon_booking.web.DTO;

public record BookingSlotDTO(
        Integer slotId,
        String startTime,
        String endTime,
        String status,
        Integer bookingId,
        String customerName,
        String customerPhone,
        Integer serviceId,
        String serviceName,
        String serviceDescription,
        Double servicePrice
) {}