package dh13c8.hotel;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE " +
            "(:city IS NULL OR :city = '' OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:minRating IS NULL OR h.starRating >= :minRating)")
    Page<Hotel> searchHotels(
            @Param("city") String city,
            @Param("minRating") Integer minRating,
            Pageable pageable
    );
}