package rere.projects.barber_salon_booking.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rere.projects.barber_salon_booking.entity.AvailableTimeSlot;
import rere.projects.barber_salon_booking.entity.Booking;
import rere.projects.barber_salon_booking.repository.AvailableSlotCommandRepository;
import rere.projects.barber_salon_booking.repository.BookingRepository;
import rere.projects.barber_salon_booking.web.DTO.BookingCreateDto;

import java.sql.Time;
import java.time.format.TextStyle;
import java.util.Locale;

@RestController
@RequestMapping("/api/owner/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingCommandController {

    private final BookingRepository bookingRepo;
    private final AvailableSlotCommandRepository slotCommandRepo;

    public BookingCommandController(
            BookingRepository bookingRepo,
            AvailableSlotCommandRepository slotCommandRepo
    ) {
        this.bookingRepo = bookingRepo;
        this.slotCommandRepo = slotCommandRepo;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingCreateDto dto) {

        String day = dto.date()
                .getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        Time start = Time.valueOf(dto.startTime());
        Time end = Time.valueOf(dto.endTime());

        AvailableTimeSlot slot = slotCommandRepo
                .findAvailableSlotForBooking(dto.salonId(), day, start, end)
                .orElseThrow(() -> new RuntimeException("No available slot found"));

        // mark slot booked
        slot.setStatus("BOOKED");
        slotCommandRepo.save(slot);

        Booking booking = new Booking();
        booking.setSlotId(slot.getId());
        booking.setCustomerId(dto.customerId()); // لازم تبعتيه من الفرونت
        booking.setStatus(dto.status() != null ? dto.status() : "CONFIRMED");

        return ResponseEntity.ok(bookingRepo.save(booking));
    }
}
