package rere.projects.barber_salon_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rere.projects.barber_salon_booking.entity.Booking;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {


    @Query(value = """
        SELECT COUNT(b.booking_id)
        FROM booking b
        JOIN available_time_slot s ON s.slot_id = b.slot_id
        WHERE s.salon_id = :salonId 
          AND s.slot_date = :date 
          AND b.status IN ('PENDING', 'CONFIRMED')
    """, nativeQuery = true)
    Long countDailyBookings(@Param("salonId") Integer salonId, @Param("date") String date);

    // count bookings between dates
    @Query(value = """
        SELECT COUNT(b.booking_id)
        FROM booking b
        JOIN available_time_slot s ON s.slot_id = b.slot_id
        WHERE s.salon_id = :salonId 
          AND s.slot_date BETWEEN :startDate AND :endDate 
          AND b.status IN ('PENDING', 'CONFIRMED')
    """, nativeQuery = true)
    Long countBookingsBetween(@Param("salonId") Integer salonId,
                              @Param("startDate") String startDate,
                              @Param("endDate") String endDate);


    @Query(value = """
    SELECT 
        CAST(s.start_time AS VARCHAR) || ' - ' || CAST(s.end_time AS VARCHAR) AS timeSlot,
        COUNT(b.booking_id) AS count
    FROM booking b
    JOIN available_time_slot s ON s.slot_id = b.slot_id
    WHERE s.salon_id = :salonId
      AND s.slot_date BETWEEN :startDate AND :endDate
      AND b.status IN ('PENDING', 'CONFIRMED')
    GROUP BY s.start_time, s.end_time
    ORDER BY count DESC
""", nativeQuery = true)
    List<Object[]> findMostRequestedTimes(
            @Param("salonId") Integer salonId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

}