package dh13c8.user.service;

import dh13c8.common.dto.AuthResponse;
import dh13c8.common.dto.LoginRequest;
import dh13c8.common.dto.RegisterRequest;
import dh13c8.common.exception.BusinessException;
import dh13c8.common.util.JwtUtil;
import dh13c8.common.util.PasswordEncoder;
import dh13c8.user.entity.User;
import dh13c8.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Kiem tra email da ton tai
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists", 409);
        }

        // Tao user moi
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(PasswordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setStatus(User.UserStatus.ACTIVE);
        user.setUserType(User.UserType.CUSTOMER);

        User savedUser = userRepository.save(user);
        log.info("User registered: {}", savedUser.getEmail());

        // Tao JWT token
        String token = JwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getUserType().toString());

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                token
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid email or password", 401));

        // Kiem tra password
        if (!PasswordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Invalid email or password", 401);
        }

        // Kiem tra status
        if (user.getStatus() == User.UserStatus.BANNED) {
            throw new BusinessException("User account is banned", 403);
        }

        if (user.getStatus() == User.UserStatus.INACTIVE) {
            throw new BusinessException("User account is inactive", 403);
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in: {}", user.getEmail());

        // Tao JWT token
        String token = JwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserType().toString());

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                token
        );
    }
}
