package rere.projects.barber_salon_booking.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rere.projects.barber_salon_booking.entity.Service;
import rere.projects.barber_salon_booking.repository.ServiceRepository;
import rere.projects.barber_salon_booking.web.DTO.ServiceCreateDto;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ServiceController {

    private final ServiceRepository serviceRepo;

    public ServiceController(ServiceRepository serviceRepo) {
        this.serviceRepo = serviceRepo;
    }

    // list services for a salon
    @GetMapping("/salons/{salonId}/services")
    public List<Service> getServices(@PathVariable Integer salonId) {
        return serviceRepo.findBySalonIdOrderByServiceNameAsc(salonId);
    }

    // create a new service
    @PostMapping("/services")
    public ResponseEntity<Service> create(@RequestBody ServiceCreateDto dto) {
        Service s = new Service();
        s.setSalonId(dto.salonId());
        s.setServiceName(dto.serviceName());
        s.setDescription(dto.description());
        s.setPrice(dto.price());
        s.setDefaultDuration(dto.defaultDuration());
        s.setImageUrl(dto.imageUrl());

        Service saved = serviceRepo.save(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // update service
    @PutMapping("/services/{id}")
    public ResponseEntity<Service> update(@PathVariable Integer id, @RequestBody ServiceCreateDto dto) {
        return serviceRepo.findById(id)
                .map(existing -> {
                    existing.setSalonId(dto.salonId());
                    existing.setServiceName(dto.serviceName());
                    existing.setDescription(dto.description());
                    existing.setPrice(dto.price());
                    existing.setDefaultDuration(dto.defaultDuration());
                    existing.setImageUrl(dto.imageUrl());
                    return ResponseEntity.ok(serviceRepo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // delete service
    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!serviceRepo.existsById(id)) return ResponseEntity.notFound().build();
        serviceRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
