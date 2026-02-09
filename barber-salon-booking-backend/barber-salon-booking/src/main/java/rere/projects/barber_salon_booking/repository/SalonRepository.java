package rere.projects.barber_salon_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rere.projects.barber_salon_booking.entity.Salon;
import java.util.List;

public interface SalonRepository extends JpaRepository<Salon, Integer> {
    List<Salon> findByIsActiveTrueOrderBySalonNameAsc();
}

