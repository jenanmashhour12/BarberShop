package rere.projects.barber_salon_booking.web.DTO;

public record ServiceCreateDto(
        Integer salonId,
        String serviceName,
        String description,
        Double price,
        Integer defaultDuration,
        String imageUrl
) {}
