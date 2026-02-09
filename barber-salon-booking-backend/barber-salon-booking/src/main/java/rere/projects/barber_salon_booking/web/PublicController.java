package rere.projects.barber_salon_booking.web;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import rere.projects.barber_salon_booking.entity.Salon;
import rere.projects.barber_salon_booking.repository.SalonRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import rere.projects.barber_salon_booking.web.DTO.SalonCreateDto;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:4200")
public class PublicController {
    private final SalonRepository salonRepo;
    public PublicController(SalonRepository salonRepo) { this.salonRepo = salonRepo; }

    @GetMapping("/salons")
    public List<Salon> salons() {
        return salonRepo.findByIsActiveTrueOrderBySalonNameAsc();
    }

    @PostMapping("/salons")
    public ResponseEntity<Salon> create(@RequestBody SalonCreateDto dto) {
        Salon s = new Salon();
        s.setOwnerUserId(dto.ownerUserId());
        s.setSalonName(dto.salonName());
        s.setPhone(dto.phone());
        s.setAddress(dto.address());
        s.setActive(Boolean.TRUE.equals(dto.active()));
        Salon saved = salonRepo.save(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/salons/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!salonRepo.existsById(id)) return ResponseEntity.notFound().build();
        salonRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
