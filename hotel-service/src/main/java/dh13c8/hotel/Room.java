package dh13c8.hotel;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hotel_id")
    private Long hotelId;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "room_type")
    private String roomType;

    private Integer capacity;

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "bed_type")
    private String bedType;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "area_sqm")
    private BigDecimal areaSqm;

    private String status;

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getMaxGuests() { return maxGuests; }
    public void setMaxGuests(Integer maxGuests) { this.maxGuests = maxGuests; }

    public String getBedType() { return bedType; }
    public void setBedType(String bedType) { this.bedType = bedType; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public BigDecimal getAreaSqm() { return areaSqm; }
    public void setAreaSqm(BigDecimal areaSqm) { this.areaSqm = areaSqm; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}