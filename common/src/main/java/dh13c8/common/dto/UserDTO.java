package dh13c8.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    private String email;

    private String fullName;

    private String phoneNumber;

    private String gender;

    private String address;

    private String city;

    private String country;

    private String postalCode;

    private String avatarUrl;

    private String status;

    private String userType;

    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;
}
