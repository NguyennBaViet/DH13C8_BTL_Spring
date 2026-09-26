# PLAN CHI TIET - HE THONG DAT PHONG KHACH SAN

## PHAN 1: TONG QUAN DU AN

### Muc Tieu
Phat trien he thong dat phong khach san day du cac tinh nang:
- Dang ky va dang nhap nguoi dung
- Tim kiem va dat phong
- Thanh toan va hoa don
- Danh gia va nhan xet
- Quan ly khach san va phong (admin)
- Quan ly promotions va khuyen mai
- Lich su dat phong va giao dich

### Cong Nghe
- Spring Boot 2.7.x / 3.x
- MySQL / MariaDB (via phpMyAdmin)
- REST API (HTTP/JSON)
- JWT Authentication
- Maven
- JPA/Hibernate

---

## PHAN 2: KIEN TRUC SYSTEM

### 2.1 Kiến Trúc Microservices với API Gateway

```
Client Web/Mobile
      |
      v
API Gateway (Port 8000)
   - Route den cac services
   - Authentication & Authorization
   - Rate limiting
      |
      +---> User Service (Port 8001)
      |
      +---> Hotel Service (Port 8002)
      |
      +---> Booking Service (Port 8003)
      |
      +---> Payment Service (Port 8004)
      |
      +---> Review Service (Port 8005)
      |
      v
MySQL Database: KhachSan
```

Mỗi service là một ứng dụng Spring Boot độc lập với:
- Riêng package và controller
- Riêng JPA entities và repositories
- Riêng business logic
- Có thể có database riêng (tùy chọn) hoặc chia sẻ

Để đơn giản, ta dùng 1 database chung KhachSan cho tất cả services.

### 2.2 Chi Tiết Các Microservices

#### **API Gateway (Port 8000)**
- Route requests đến các services thích hợp
- JWT token validation
- Rate limiting
- CORS handling
- Logging requests

#### **User Service (Port 8001)**
- user-service/
- Đăng ký, đăng nhập, quản lý tài khoản
- AuthController
- UserController

#### **Hotel Service (Port 8002)**
- hotel-service/
- Quản lý khách sạn, phòng, tiện ích
- HotelController
- RoomController
- AmenityController

#### **Booking Service (Port 8003)**
- booking-service/
- Quản lý đặt phòng, khả dụng phòng
- BookingController
- RoomAvailabilityController

#### **Payment Service (Port 8004)**
- payment-service/
- Xử lý thanh toán, hoàn tiền
- PaymentController
- InvoiceController

#### **Review Service (Port 8005)**
- review-service/
- Quản lý đánh giá, ratings
- ReviewController
- RatingController

---

## PHAN 3: DATABASE SCHEMA - BANG DU LIEU

### 3.1 Bảng USERS
Luu thong tin nguoi dung

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    avatar_url VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    user_type ENUM('CUSTOMER', 'ADMIN', 'HOTEL_OWNER', 'STAFF') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
);
```

### 3.2 Bảng HOTELS
Luu thong tin khach san

```sql
CREATE TABLE hotels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_name VARCHAR(200) NOT NULL,
    description LONGTEXT,
    owner_id BIGINT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    star_rating INT DEFAULT 3,
    total_rooms INT DEFAULT 0,
    available_rooms INT DEFAULT 0,
    image_url VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_status (status)
);
```

### 3.3 Bảng ROOMS
Luu thong tin phong

```sql
CREATE TABLE rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_type ENUM('SINGLE', 'DOUBLE', 'TRIPLE', 'SUITE', 'DELUXE', 'PENTHOUSE') NOT NULL,
    capacity INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    description LONGTEXT,
    max_guests INT NOT NULL,
    bed_type ENUM('SINGLE_BED', 'DOUBLE_BED', 'TWIN_BEDS', 'KING_BED', 'QUEEN_BED') NOT NULL,
    floor_number INT,
    area_sqm DECIMAL(8, 2),
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_room_number (hotel_id, room_number)
);
```

### 3.4 Bảng AMENITIES
Luu danh sach tien ich

```sql
CREATE TABLE amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    category ENUM('ROOM', 'HOTEL', 'PAYMENT') DEFAULT 'ROOM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name)
);
```

### 3.5 Bảng ROOM_AMENITIES
Lien ket phong voi tien ich

```sql
CREATE TABLE room_amenities (
    room_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);
```

### 3.6 Bảng ROOM_AVAILABILITY
Quan ly kha dung phong theo ngay

```sql
CREATE TABLE room_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    price_override DECIMAL(10, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_available_date (available_date),
    UNIQUE KEY unique_room_date (room_id, available_date)
);
```

### 3.7 Bảng BOOKINGS
Luu thong tin dat phong

```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT NOT NULL,
    number_of_rooms INT NOT NULL DEFAULT 1,
    guest_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    special_requests LONGTEXT,
    booking_status ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED') DEFAULT 'PENDING',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancellation_date TIMESTAMP,
    cancellation_reason LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_booking_status (booking_status)
);
```

### 3.8 Bảng PAYMENTS
Luu thong tin thanh toan

```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'WALLET', 'CASH') NOT NULL,
    transaction_id VARCHAR(100),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    refund_date TIMESTAMP,
    refund_amount DECIMAL(10, 2),
    receipt_url VARCHAR(500),
    notes LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_id (booking_id)
);
```

### 3.9 Bảng REVIEWS
Luu danh gia khach san

```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    overall_rating INT NOT NULL,
    cleanliness_rating INT,
    comfort_rating INT,
    service_rating INT,
    value_rating INT,
    title VARCHAR(200) NOT NULL,
    comment LONGTEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    review_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    response_from_manager LONGTEXT,
    response_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_user_id (user_id),
    INDEX idx_review_status (review_status)
);
```

### 3.10 Bảng PROMOTIONS
Luu khuyen mai va ma giam gia

```sql
CREATE TABLE promotions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    hotel_id BIGINT,
    discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_usage_count INT,
    current_usage_count INT DEFAULT 0,
    min_stay_nights INT DEFAULT 1,
    min_booking_amount DECIMAL(10, 2),
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    INDEX idx_promo_code (promo_code),
    INDEX idx_end_date (end_date)
);
```

### 3.11 Bảng AUDIT_LOG
Ghi log hoat dong quan trong

```sql
CREATE TABLE audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    old_value LONGTEXT,
    new_value LONGTEXT,
    description VARCHAR(255),
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_created_at (created_at),
    INDEX idx_entity_type (entity_type)
);
```

---

## PHAN 4: CAC TINH NANG CHINH

### Module 1: Authentication & Users
- Dang ky tui khoan moi
- Dang nhap va tao JWT token
- Xac thuc bang JWT
- Cap nhat thong tin ca nhan
- Thay doi mat khau
- Xem lich su dat phong

### Module 2: Hotel Management
- Liệt kê danh sách khách sạn (có phân trang, tìm kiếm theo thành phố)
- Xem chi tiết khách sạn
- Tạo/cập nhật/xóa khách sạn (admin hoặc chủ sở hữu)
- Quản lý tiện ích khách sạn
- Xem thống kê phòng

### Module 3: Room Management
- Liệt kê phòng theo khách sạn
- Tìm kiếm phòng trống (check-in/check-out)
- Xem chi tiết phòng
- Tạo/cập nhật/xóa phòng (admin)
- Quản lý giá phòng
- Quản lý khả dụng phòng theo ngày

### Module 4: Booking Management
- Tạo đặt phòng mới
- Kiểm tra tính khả dụng trước khi đặt
- Xem danh sách đặt phòng người dùng
- Xem chi tiết đặt phòng
- Hủy đặt phòng
- Xác nhận đặt phòng (admin)

### Module 5: Payment Processing
- Xử lý thanh toán cho đặt phòng
- Lưu lịch sử thanh toán
- Hoàn tiền (refund)
- Tạo hóa đơn điện tử
- Quản lý phương thức thanh toán

### Module 6: Reviews & Ratings
- Tạo đánh giá khách sạn
- Liệt kê đánh giá khách sạn
- Cập nhật đánh giá
- Xóa đánh giá
- Phê duyệt đánh giá (admin)
- Trả lời đánh giá (chủ khách sạn)

### Module 7: Promotions & Discounts
- Tạo mã giảm giá
- Áp dụng mã giảm giá khi đặt phòng
- Quản lý khuyến mãi theo thời gian
- Kiểm tra hạn chế sử dụng mã

### Module 8: Admin Dashboard
- Xem thống kê tổng quan
- Quản lý người dùng
- Quản lý khách sạn
- Quản lý đặt phòng
- Xem báo cáo doanh thu

---

## PHAN 5: CAP NHAT BANG AVAILABILITY

Khi co booking:
1. Kiem tra room_availability cho tung ngay trong khoang check-in den check-out
2. Cap nhat is_available = FALSE
3. Update status phong sang RESERVED neu co nhieu bookings

---

## PHAN 6: LUONG HOAT DONG

### Luong Dat Phong
1. Nguoi dung tim kiem phong (GET /api/rooms/search)
2. Kiem tra kha dung tu room_availability
3. Xem chi tiet phong va gia
4. Tao booking moi (POST /api/bookings)
5. Thanh toan (POST /api/payments)
6. Cap nhat room_availability
7. Gui email xac nhan

### Luong Huy Phong
1. Nguoi dung yeu cau huy (PUT /api/bookings/{id}/cancel)
2. Kiem tra co the huy khong
3. Xoa khoa phong tu room_availability
4. Xu ly hoan tien (POST /api/payments/{id}/refund)
5. Cap nhat booking_status = CANCELLED

### Luong Danh Gia
1. Sau khi checked out, nguoi dung co the danh gia
2. Tao review (POST /api/reviews)
3. Admin phe duyet (PUT /api/reviews/{id}/approve)
4. Hien thi review tren trang chi tiet khach san

---

## PHAN 7: SECURITY

- JWT token co thoi gian het han 24h
- Refresh token de lay token moi
- Encryption mat khau bang BCrypt
- Role-based access control (CUSTOMER, ADMIN, HOTEL_OWNER)
- Audit log cho cac tac vu quan trong

---

## PHAN 8: FOLDER STRUCTURE - MICROSERVICES ARCHITECTURE

```
khachsan-microservices/
│
├── api-gateway/                     (Port 8000)
│   ├── src/main/java/dh13c8/gateway/
│   │   ├── GatewayApplication.java
│   │   ├── config/
│   │   │   ├── GatewayConfig.java
│   │   │   ├── JwtTokenValidator.java
│   │   │   └── CorsConfig.java
│   │   ├── filter/
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── LoggingFilter.java
│   │   └── controller/
│   │       └── HealthController.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
│
├── user-service/                    (Port 8001)
│   ├── src/main/java/dh13c8/user/
│   │   ├── UserServiceApplication.java
│   │   ├── api/
│   │   │   ├── AuthController.java
│   │   │   └── UserController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   └── UserService.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── entity/
│   │   │   └── User.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── UserDTO.java
│   │   │   └── AuthResponse.java
│   │   ├── util/
│   │   │   ├── JwtUtil.java
│   │   │   └── PasswordEncoder.java
│   │   ├── config/
│   │   │   └── JpaConfig.java
│   │   └── exception/
│   │       ├── DuplicateEmailException.java
│   │       └── InvalidCredentialsException.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
│
├── hotel-service/                   (Port 8002)
│   ├── src/main/java/dh13c8/hotel/
│   │   ├── HotelServiceApplication.java
│   │   ├── api/
│   │   │   ├── HotelController.java
│   │   │   ├── RoomController.java
│   │   │   └── AmenityController.java
│   │   ├── service/
│   │   │   ├── HotelService.java
│   │   │   ├── RoomService.java
│   │   │   └── AmenityService.java
│   │   ├── repository/
│   │   │   ├── HotelRepository.java
│   │   │   ├── RoomRepository.java
│   │   │   └── AmenityRepository.java
│   │   ├── entity/
│   │   │   ├── Hotel.java
│   │   │   ├── Room.java
│   │   │   ├── Amenity.java
│   │   │   └── RoomAmenity.java
│   │   ├── dto/
│   │   │   ├── HotelDTO.java
│   │   │   ├── RoomDTO.java
│   │   │   └── AmenityDTO.java
│   │   ├── config/
│   │   │   └── JpaConfig.java
│   │   └── exception/
│   │       ├── HotelNotFoundException.java
│   │       └── RoomNotFoundException.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
│
├── booking-service/                 (Port 8003)
│   ├── src/main/java/dh13c8/booking/
│   │   ├── BookingServiceApplication.java
│   │   ├── api/
│   │   │   ├── BookingController.java
│   │   │   └── AvailabilityController.java
│   │   ├── service/
│   │   │   ├── BookingService.java
│   │   │   ├── AvailabilityService.java
│   │   │   └── SearchService.java
│   │   ├── repository/
│   │   │   ├── BookingRepository.java
│   │   │   ├── RoomAvailabilityRepository.java
│   │   │   └── PromotionRepository.java
│   │   ├── entity/
│   │   │   ├── Booking.java
│   │   │   ├── RoomAvailability.java
│   │   │   └── Promotion.java
│   │   ├── dto/
│   │   │   ├── BookingDTO.java
│   │   │   ├── CreateBookingRequest.java
│   │   │   └── SearchRoomRequest.java
│   │   ├── config/
│   │   │   └── JpaConfig.java
│   │   ├── exception/
│   │   │   ├── BookingNotFoundException.java
│   │   │   ├── InvalidBookingException.java
│   │   │   └── RoomNotAvailableException.java
│   │   └── client/
│   │       └── HotelServiceClient.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
│
├── payment-service/                 (Port 8004)
│   ├── src/main/java/dh13c8/payment/
│   │   ├── PaymentServiceApplication.java
│   │   ├── api/
│   │   │   ├── PaymentController.java
│   │   │   └── InvoiceController.java
│   │   ├── service/
│   │   │   ├── PaymentService.java
│   │   │   └── InvoiceService.java
│   │   ├── repository/
│   │   │   ├── PaymentRepository.java
│   │   │   └── InvoiceRepository.java
│   │   ├── entity/
│   │   │   ├── Payment.java
│   │   │   └── Invoice.java
│   │   ├── dto/
│   │   │   ├── PaymentDTO.java
│   │   │   ├── CreatePaymentRequest.java
│   │   │   └── RefundRequest.java
│   │   ├── config/
│   │   │   └── JpaConfig.java
│   │   ├── exception/
│   │   │   ├── PaymentProcessingException.java
│   │   │   └── RefundException.java
│   │   └── client/
│   │       └── BookingServiceClient.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
│
├── review-service/                  (Port 8005)
│   ├── src/main/java/dh13c8/review/
│   │   ├── ReviewServiceApplication.java
│   │   ├── api/
│   │   │   ├── ReviewController.java
│   │   │   └── RatingController.java
│   │   ├── service/
│   │   │   ├── ReviewService.java
│   │   │   └── RatingService.java
│   │   ├── repository/
│   │   │   ├── ReviewRepository.java
│   │   │   └── RatingRepository.java
│   │   ├── entity/
│   │   │   ├── Review.java
│   │   │   └── Rating.java
│   │   ├── dto/
│   │   │   ├── ReviewDTO.java
│   │   │   ├── CreateReviewRequest.java
│   │   │   └── RatingDTO.java
│   │   ├── config/
│   │   │   └── JpaConfig.java
│   │   ├── exception/
│   │   │   ├── ReviewNotFoundException.java
│   │   │   └── InvalidRatingException.java
│   │   └── client/
│   │       └── HotelServiceClient.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   └── pom.xml
│
├── common/                          (Shared libraries)
│   ├── src/main/java/dh13c8/common/
│   │   ├── dto/
│   │   │   ├── ApiResponse.java
│   │   │   └── ErrorResponse.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── BusinessException.java
│   │   ├── util/
│   │   │   ├── DateUtils.java
│   │   │   ├── ValidationUtils.java
│   │   │   └── EncoderUtils.java
│   │   └── entity/
│   │       └── BaseEntity.java
│   └── pom.xml
│
├── pom.xml                          (Parent POM)
├── database-init.sql                (Database initialization script)
├── docker-compose.yml               (Docker services)
├── PLAN_CHI_TIET.md
└── ARCHITECTURE.md
```

---

## PHAN 9: TECHNOLOGIES & DEPENDENCIES

Spring Boot Starters (cho moi service):
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- mysql-connector-java
- jwt (jjwt)
- bcrypt
- lombok (optional)
- spring-boot-starter-test
- spring-cloud-starter-gateway (chi dung cho API Gateway)
- spring-cloud-starter-config (optional)
- spring-boot-starter-actuator (dung cho health checks)

---

## PHAN 10: GIAI DOAN THUC HIEN

### Phase 1: Setup Co Ban (Tuan 1)
- Tao database va bang
- Tao project structures
- Tao pom.xml cho tung service
- Cau hinh application.yml

### Phase 2: Setup API Gateway (Tuan 1)
- Tao api-gateway Spring Boot application
- Cau hinh routing rules
- JWT token validation
- Error handling

### Phase 3: User Service (Tuan 1-2)
- Tao user-service Spring Boot application
- JWT utility
- AuthController va AuthService
- UserController va UserService
- Password encoder

### Phase 4: Hotel & Room Service (Tuan 2-3)
- Tao hotel-service Spring Boot application
- HotelService, HotelController
- RoomService, RoomController
- AmenityService, AmenityController
- Search functionality

### Phase 5: Booking Service (Tuan 3-4)
- Tao booking-service Spring Boot application
- BookingService, BookingController
- AvailabilityService
- Room availability logic
- Call hotel-service via REST

### Phase 6: Payment Service (Tuan 4)
- Tao payment-service Spring Boot application
- PaymentService, PaymentController
- Payment processing
- Refund logic

### Phase 7: Review Service (Tuan 4-5)
- Tao review-service Spring Boot application
- ReviewService, ReviewController
- Rating logic
- Review approval workflow

### Phase 8: Integration (Tuan 5-6)
- Test communication giua services
- Common library cho DTOs va exceptions
- Error handling across services
- Logging

### Phase 9: Testing (Tuan 6-7)
- Unit tests cho moi service
- Integration tests
- API testing voi Postman/cURL
- Performance testing

### Phase 10: Documentation (Tuan 7-8)
- API documentation (Swagger/OpenAPI)
- Deployment guide
- README files
- Database schema documentation

---

## PHAN 11: KINH NGIEM VA LUU Y

1. Luon tim kiem phong availability truoc khi tao booking
2. Sau khi tao booking thanh cong, cap nhat room_availability
3. JWT token khong luu trong database, chi verify dua tren secret key
4. Audit log quan trong cho tracking cac thay doi trong system
5. Nên tao base entity class voi id, createdAt, updatedAt
6. Dung DTOs de trao doi voi client, khong tra Entity truc tiep
7. Validate input o controller level
8. Handle exceptions va tra response mang y nghia
9. Tao indexes cho cac columns dung trong WHERE clauses
10. Regular backups cho database
