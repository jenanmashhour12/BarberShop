package rere.projects.barber_salon_booking.entity;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "available_time_slot")
public class AvailableTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Integer id;

    @Column(name = "salon_id", nullable = false)
    private Integer salonId;

    @Column(name = "slot_date", nullable = false)
    private Date slotDate;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private Time startTime;

    @Column(name = "end_time", nullable = false)
    private Time endTime;

    @Column(name = "status", nullable = false)
    private String status;

    // getters setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getSalonId() { return salonId; }
    public void setSalonId(Integer salonId) { this.salonId = salonId; }

    public Date getSlotDate() { return slotDate; }
    public void setSlotDate(Date slotDate) { this.slotDate = slotDate; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public Time getStartTime() { return startTime; }
    public void setStartTime(Time startTime) { this.startTime = startTime; }

    public Time getEndTime() { return endTime; }
    public void setEndTime(Time endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
