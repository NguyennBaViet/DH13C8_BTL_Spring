package dh13c8.user.entity;

import dh13c8.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column
    private String address;

    @Column
    private String city;

    @Column
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", columnDefinition = "VARCHAR(50) DEFAULT 'CUSTOMER'")
    private UserType userType = UserType.CUSTOMER;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, BANNED
    }

    public enum UserType {
        CUSTOMER, ADMIN, HOTEL_OWNER, STAFF
    }
}
