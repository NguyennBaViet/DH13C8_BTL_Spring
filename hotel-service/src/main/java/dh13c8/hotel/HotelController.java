package dh13c8.hotel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHotels(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "city", required = false) String city,
            @RequestParam(name = "minRating", required = false) Integer minRating
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Hotel> result = hotelRepository.searchHotels(city, minRating, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tải danh sách khách sạn thành công");
        response.put("data", result);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getHotelById(@PathVariable(name = "id") Long id) {
        return hotelRepository.findById(id)
                .map(hotel -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("data", hotel);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}