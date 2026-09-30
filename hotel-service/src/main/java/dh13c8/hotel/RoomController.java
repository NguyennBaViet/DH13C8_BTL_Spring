package dh13c8.hotel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRooms(
            @RequestParam(name = "hotelId", required = false) Long hotelId,
            @RequestParam(name = "roomType", required = false) String roomType,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice
    ) {
        List<Room> rooms = roomRepository.searchRooms(hotelId, roomType, minPrice, maxPrice);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Tải danh sách phòng thành công");
        response.put("data", rooms);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRoomById(@PathVariable(name = "id") Long id) {
        return roomRepository.findById(id)
                .map(room -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("data", room);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}