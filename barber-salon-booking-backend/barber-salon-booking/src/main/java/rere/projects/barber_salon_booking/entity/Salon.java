package rere.projects.barber_salon_booking.entity;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name="salon")
@Getter @Setter
public class Salon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="salon_id") private Integer id;

    @Column(name="user_id", nullable=false) private Integer ownerUserId;
    @Column(name="salon_name", nullable=false) private String salonName;

    private String phone;
    private String address;

    @Column(name="is_active", nullable=false) private boolean isActive;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(Integer ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getSalonName() {
        return salonName;
    }

    public void setSalonName(String salonName) {
        this.salonName = salonName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
