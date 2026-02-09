package rere.projects.barber_salon_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rere.projects.barber_salon_booking.entity.AvailableTimeSlot;

import java.sql.Time;
import java.util.Optional;

public interface AvailableSlotCommandRepository extends JpaRepository<AvailableTimeSlot, Integer> {

    @Query("""
        SELECT s FROM AvailableTimeSlot s
        WHERE s.salonId = :salonId
          AND s.dayOfWeek = :day
          AND s.startTime = :start
          AND s.endTime = :end
          AND s.status = 'AVAILABLE'
    """)
    Optional<AvailableTimeSlot> findAvailableSlotForBooking(
            Integer salonId,
            String day,
            Time start,
            Time end
    );

}
