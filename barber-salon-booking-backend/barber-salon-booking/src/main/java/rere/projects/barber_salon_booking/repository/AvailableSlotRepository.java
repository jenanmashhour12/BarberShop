package rere.projects.barber_salon_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rere.projects.barber_salon_booking.entity.AvailableTimeSlot;

import java.util.List;

public interface AvailableSlotRepository extends JpaRepository<AvailableTimeSlot, Integer> {

    @Query(value = """
        SELECT
            s.slot_id,
            CAST(s.start_time AS VARCHAR) AS startTime,
            CAST(s.end_time AS VARCHAR) AS endTime,
            CASE
                WHEN b.booking_id IS NOT NULL THEN 'BOOKED'
                ELSE s.status
            END AS status,
            b.booking_id,
            NULL AS customerName,
            NULL AS customerPhone
        FROM available_time_slot s
        LEFT JOIN booking b
            ON b.slot_id = s.slot_id
            AND b.status IN ('PENDING', 'CONFIRMED')
        WHERE
            s.salon_id = :salonId
            AND s.day_of_week = :day
        ORDER BY s.start_time
    """, nativeQuery = true)
    List<Object[]> findSlotsForSalonAndDate(
            @Param("salonId") Integer salonId,
            @Param("day") String day
    );
}
