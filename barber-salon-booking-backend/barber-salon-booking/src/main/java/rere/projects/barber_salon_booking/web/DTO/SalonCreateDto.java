package rere.projects.barber_salon_booking.web.DTO;

public record SalonCreateDto(
        Integer ownerUserId,
        String salonName,
        String phone,
        String address,
        Boolean active
) {}