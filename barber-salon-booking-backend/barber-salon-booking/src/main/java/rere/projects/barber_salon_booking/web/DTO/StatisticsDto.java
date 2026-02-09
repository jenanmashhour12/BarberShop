package rere.projects.barber_salon_booking.web.DTO;

import java.util.List;

public record StatisticsDto(
        Integer dailyBookings,
        Integer weeklyBookings,
        Integer monthlyBookings,
        List<TimeSlotCountDto> mostRequestedTimes
) {}