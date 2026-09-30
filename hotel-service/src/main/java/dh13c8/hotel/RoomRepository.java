package dh13c8.hotel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r FROM Room r WHERE " +
            "(:hotelId IS NULL OR r.hotelId = :hotelId) AND " +
            "(:roomType IS NULL OR :roomType = '' OR r.roomType = :roomType) AND " +
            "(:minPrice IS NULL OR r.pricePerNight >= :minPrice) AND " +
            "(:maxPrice IS NULL OR r.pricePerNight <= :maxPrice)")
    List<Room> searchRooms(
            @Param("hotelId") Long hotelId,
            @Param("roomType") String roomType,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}