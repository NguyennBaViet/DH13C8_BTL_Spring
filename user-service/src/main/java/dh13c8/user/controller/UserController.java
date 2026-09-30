package dh13c8.user.controller;

import dh13c8.common.dto.ApiResponse;
import dh13c8.common.dto.UserDTO;
import dh13c8.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long userId) {
        log.info("Get user by id: {}", userId);
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDTO dto) {
        log.info("Update user: {}", userId);
        UserDTO updatedUser = userService.updateUser(userId, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Long userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        log.info("Change password for user: {}", userId);
        userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
