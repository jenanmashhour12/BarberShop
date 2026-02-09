package rere.projects.barber_salon_booking.web;

import org.springframework.web.bind.annotation.*;
import rere.projects.barber_salon_booking.repository.BookingRepository;
import rere.projects.barber_salon_booking.web.DTO.StatisticsDto;
import rere.projects.barber_salon_booking.web.DTO.TimeSlotCountDto;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/owner")
@CrossOrigin(origins = "http://localhost:4200")
public class StatisticsController {

    private final BookingRepository bookingRepo;

    public StatisticsController(BookingRepository bookingRepo) {
        this.bookingRepo = bookingRepo;
    }

    @GetMapping("/statistics")
    public StatisticsDto getStatistics(
            @RequestParam Integer salonId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        // ================= DATES =================
        LocalDate today = LocalDate.now();

        LocalDate start = (startDate != null)
                ? LocalDate.parse(startDate)
                : today.minusDays(30);

        LocalDate end = (endDate != null)
                ? LocalDate.parse(endDate)
                : today;

        LocalDate weekStart = today.minusDays(7);
        LocalDate monthStart = today.minusDays(30);

        // ================= COUNTS =================
        Long dailyBookingsL =
                bookingRepo.countDailyBookings(salonId, today.toString());

        Long weeklyBookingsL =
                bookingRepo.countBookingsBetween(
                        salonId,
                        weekStart.toString(),
                        today.toString()
                );

        Long monthlyBookingsL =
                bookingRepo.countBookingsBetween(
                        salonId,
                        monthStart.toString(),
                        today.toString()
                );

        // ================= MOST REQUESTED TIMES =================
        List<TimeSlotCountDto> mostRequestedTimes =
                bookingRepo.findMostRequestedTimes(
                                salonId,
                                start.toString(),
                                end.toString()
                        )
                        .stream()
                        .map(row -> new TimeSlotCountDto(
                                (String) row[0],
                                ((Number) row[1]).intValue()
                        ))
                        .toList();

        // ================= RETURN DTO =================
        return new StatisticsDto(
                dailyBookingsL.intValue(),
                weeklyBookingsL.intValue(),
                monthlyBookingsL.intValue(),
                mostRequestedTimes
        );
    }
}
