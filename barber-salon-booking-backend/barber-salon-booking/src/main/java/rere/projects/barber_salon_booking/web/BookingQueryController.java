package rere.projects.barber_salon_booking.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rere.projects.barber_salon_booking.repository.AvailableSlotRepository;
import rere.projects.barber_salon_booking.web.DTO.BookingSlotDTO;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingQueryController {

    private final AvailableSlotRepository repo;
    private static final Logger log = LoggerFactory.getLogger(BookingQueryController.class);

    public BookingQueryController(AvailableSlotRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/slots")
    public ResponseEntity<?> getSlots(
            @RequestParam Integer salonId,
            @RequestParam String date) {

        String day = LocalDate.parse(date)
                .getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        return ResponseEntity.ok(
                repo.findSlotsForSalonAndDate(salonId, day));
    }
}