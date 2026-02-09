package rere.projects.barber_salon_booking.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rere.projects.barber_salon_booking.entity.AvailableTimeSlot;
import rere.projects.barber_salon_booking.repository.AvailableSlotRepository;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/owner")
@CrossOrigin(origins = "http://localhost:4200")
public class SlotController {

    private final AvailableSlotRepository slotRepo;

    public SlotController(AvailableSlotRepository slotRepo) {
        this.slotRepo = slotRepo;
    }

    @PostMapping("/slots/batch")
    public ResponseEntity<List<AvailableTimeSlot>> registerSlots(@RequestBody RegisterSlotsRequest req) {
        List<AvailableTimeSlot> slots = new ArrayList<>();

        LocalTime start = LocalTime.parse(req.startTime);
        LocalTime end = LocalTime.parse(req.endTime);
        int duration = req.durationMin;

        LocalTime current = start;
        while (current.plusMinutes(duration).isBefore(end) || current.plusMinutes(duration).equals(end)) {

            LocalDate d = LocalDate.parse(req.slotDate);

            AvailableTimeSlot slot = new AvailableTimeSlot();
            slot.setSalonId(req.salonId);
            slot.setSlotDate(Date.valueOf(d));
            slot.setDayOfWeek(d.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH));
            slot.setStartTime(Time.valueOf(current));
            slot.setEndTime(Time.valueOf(current.plusMinutes(duration)));
            slot.setStatus("AVAILABLE");


            slots.add(slotRepo.save(slot));
            current = current.plusMinutes(duration);
        }


        return ResponseEntity.ok(slots);
    }

    @PutMapping("/slots/{id}")
    public ResponseEntity<AvailableTimeSlot> updateSlot(@PathVariable Integer id, @RequestBody UpdateSlotRequest req) {
        return slotRepo.findById(id)
                .map(slot -> {
                    if (req.startTime != null) slot.setStartTime(Time.valueOf(req.startTime + ":00"));
                    if (req.endTime != null) slot.setEndTime(Time.valueOf(req.endTime + ":00"));
                    if (req.status != null) slot.setStatus(req.status);
                    return ResponseEntity.ok(slotRepo.save(slot));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Integer id) {
        if (!slotRepo.existsById(id)) return ResponseEntity.notFound().build();
        slotRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    public static class RegisterSlotsRequest {
        public Integer salonId;
        public String slotDate;
        public String startTime;
        public String endTime;
        public Integer durationMin;
        public String dayOfWeek;
    }

    public static class UpdateSlotRequest {
        public String startTime;
        public String endTime;
        public String status;
    }
}