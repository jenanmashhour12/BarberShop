
package rere.projects.barber_salon_booking.web.DTO;


public record SlotUpdateDto(
        String startTime,
        String endTime,
        String status
) {}


record RegisterSlotsDto(
        Integer salonId,
        String slotDate,
        String startTime,
        String endTime,
        Integer durationMin
) {}