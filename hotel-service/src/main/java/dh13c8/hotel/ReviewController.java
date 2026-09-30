package dh13c8.hotel;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Map<String, Object>> getHotelReviews(
            @PathVariable(name = "hotelId") Long hotelId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        // Trả về danh sách đánh giá rỗng đúng chuẩn PaginatedResponse để Promise.all không bị lỗi 404
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tải đánh giá thành công");
        response.put("data", new PageImpl<>(Collections.emptyList(), PageRequest.of(page, size), 0));

        return ResponseEntity.ok(response);
    }
}