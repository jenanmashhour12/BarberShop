package rere.projects.barber_salon_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rere.projects.barber_salon_booking.entity.Service;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Integer> {
    List<Service> findBySalonIdOrderByServiceNameAsc(Integer salonId);
}
