package dh13c8.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long userId;
    private String email;
    private String fullName;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;

    public AuthResponse(Long userId, String email, String fullName, String accessToken) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.expiresIn = 86400L;
    }
}
