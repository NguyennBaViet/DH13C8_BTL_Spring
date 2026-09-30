# Kiến Trúc Microservice - Hệ Thống Đặt Phòng Khách Sạn

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Mục Tiêu
Xây dựng một hệ thống quản lý và đặt phòng khách sạn hiện đại sử dụng kiến trúc Microservice với Spring Boot, cho phép:
- Quản lý thông tin khách sạn, phòng, và tiện ích
- Tìm kiếm và đặt phòng trực tuyến
- Quản lý giá, khuyến mãi, và tính khả dụng
- Xử lý thanh toán và hoá đơn
- Xử lý đánh giá, nhận xét, và rating
- Quản lý người dùng, tài khoản, và vai trò
- Lịch sử đặt phòng và hóa đơn
- Thống kê và báo cáo

### 1.2 Công Nghệ Sử Dụng
- **Framework**: Spring Boot 2.7.x / 3.x
- **Database**: MySQL 8.0 / MariaDB (via phpMyAdmin)
- **Communication**: REST API (HTTP/JSON)
- **Build Tool**: Maven
- **Language**: Java 23
- **ORM**: JPA/Hibernate
- **Authentication**: JWT Token
- **Validation**: Jakarta Bean Validation

---

## 2. KIẾN TRÚC HỆ THỐNG (ĐƠNGIẢN)

### 2.1 Thiết Kế Monolithic Microservices
Thay vì tách thành nhiều service độc lập, ta sẽ tổ chức theo domain logic (packages):

```
Khach San Application (Single Spring Boot App - Port 8080)
    │
    ├── api
    │   ├── UserController
    │   ├── HotelController
    │   ├── RoomController
    │   ├── BookingController
    │   ├── PaymentController
    │   ├── ReviewController
    │   └── AuthController
    │
    ├── service
    │   ├── UserService
    │   ├── HotelService
    │   ├── RoomService
    │   ├── BookingService
    │   ├── PaymentService
    │   ├── ReviewService
    │   └── AuthService
    │
    ├── repository
    │   ├── UserRepository
    │   ├── HotelRepository
    │   ├── RoomRepository
    │   ├── BookingRepository
    │   ├── PaymentRepository
    │   ├── ReviewRepository
    │   └── AmenityRepository
    │
    ├── entity
    │   ├── User
    │   ├── Hotel
    │   ├── Room
    │   ├── Booking
    │   ├── Payment
    │   ├── Review
    │   ├── Amenity
    │   ├── RoomAvailability
    │   └── AuditLog
    │
    ├── dto
    │   ├── UserDTO
    │   ├── HotelDTO
    │   ├── RoomDTO
    │   ├── BookingDTO
    │   ├── PaymentDTO
    │   └── ReviewDTO
    │
    ├── util
    │   ├── JwtUtil
    │   ├── PasswordEncoder
    │   └── CommonUtils
    │
    └── config
        ├── JwtSecurityConfig
        ├── DatabaseConfig
        └── RestTemplateConfig
                │
                ▼
        MySQL Database KhachSan (MariaDB)
        (Accessed via phpMyAdmin - localhost:8888)
```

### 2.2 Các Thành Phần Chính

#### **AuthController & AuthService**
- Đăng ký tài khoản mới
- Đăng nhập và cấp JWT token
- Refresh token
- Logout

#### **UserController & UserService**
- Lấy thông tin người dùng
- Cập nhật thông tin cá nhân
- Thay đổi mật khẩu
- Quản lý địa chỉ giao hàng
- Xem lịch sử đặt phòng

#### **HotelController & HotelService**
- Lấy danh sách khách sạn (có phân trang, tìm kiếm)
- Lấy chi tiết khách sạn
- Tạo/cập nhật/xóa khách sạn (admin)
- Lấy danh sách amenities
- Xem thống kê khách sạn

#### **RoomController & RoomService**
- Lấy danh sách phòng theo khách sạn
- Tìm kiếm phòng trống (check-in/check-out)
- Lấy chi tiết phòng
- Tạo/cập nhật/xóa phòng (admin)
- Quản lý giá phòng
- Quản lý khả dụng phòng

#### **BookingController & BookingService**
- Tạo đặt phòng mới
- Lấy danh sách đặt phòng người dùng
- Lấy chi tiết đặt phòng
- Hủy đặt phòng
- Xác nhận đặt phòng (admin)
- Kiểm tra tính khả dụng phòng

#### **PaymentController & PaymentService**
- Xử lý thanh toán đặt phòng
- Lấy lịch sử thanh toán
- Hoàn tiền
- Tạo hóa đơn
- Quản lý phương thức thanh toán

#### **ReviewController & ReviewService**
- Tạo đánh giá cho khách sạn
- Lấy danh sách đánh giá khách sạn
- Cập nhật đánh giá của mình
- Xóa đánh giá
- Phê duyệt đánh giá (admin)

---

## 3. THIẾT KẾ DATABASE

### 3.1 Các Bảng Chính

```sql
-- 1. USERS (User Service)
- id (PK)
- email (UNIQUE)
- password_hash
- full_name
- phone_number
- date_of_birth
- gender
- address
- city
- country
- postal_code
- avatar_url
- status (ACTIVE, INACTIVE, BANNED)
- created_at
- updated_at
- last_login

-- 2. ROLES (User Service)
- id (PK)
- role_name (ADMIN, USER, STAFF, MANAGER)
- description
- permissions (JSON)

-- 3. USER_ROLES (User Service - Join Table)
- user_id (FK)
- role_id (FK)

-- 4. HOTELS (Hotel Service)
- id (PK)
- hotel_name
- description
- owner_id (FK -> users)
- address
- city
- country
- postal_code
- phone_number
- email
- website
- check_in_time
- check_out_time
- star_rating (1-5)
- total_rooms
- available_rooms
- amenities (JSON)
- image_url
- status (ACTIVE, INACTIVE, MAINTENANCE)
- created_at
- updated_at

-- 5. ROOMS (Hotel Service)
- id (PK)
- hotel_id (FK)
- room_number
- room_type (SINGLE, DOUBLE, SUITE, DELUXE)
- capacity
- price_per_night
- description
- amenities (JSON)
- images (JSON)
- status (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)
- max_guests
- bed_type
- floor_number
- created_at
- updated_at

-- 6. ROOM_AVAILABILITY (Hotel Service)
- id (PK)
- room_id (FK)
- available_date
- is_available
- price_override (tùy chọn)
- last_updated

-- 7. BOOKINGS (Booking Service)
- id (PK)
- user_id (FK)
- hotel_id (FK)
- room_id (FK)
- check_in_date
- check_out_date
- number_of_guests
- number_of_rooms
- total_price
- special_requests (TEXT)
- booking_status (PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)
- payment_status (PENDING, PAID, REFUNDED)
- booking_date
- cancellation_date
- cancellation_reason
- created_at
- updated_at

-- 8. PAYMENTS (Payment Service)
- id (PK)
- booking_id (FK)
- user_id (FK)
- amount
- currency
- payment_method (CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, WALLET)
- transaction_id
- payment_status (PENDING, SUCCESS, FAILED, REFUNDED)
- payment_date
- refund_date
- refund_amount
- receipt_url
- notes
- created_at
- updated_at

-- 9. REVIEWS (Hotel Service)
- id (PK)
- hotel_id (FK)
- user_id (FK)
- booking_id (FK)
- rating (1-5)
- title
- comment
- cleanliness_rating
- comfort_rating
- service_rating
- value_rating
- images (JSON)
- helpful_count
- review_status (PENDING, APPROVED, REJECTED)
- created_at
- updated_at

-- 10. AMENITIES (Hotel Service)
- id (PK)
- name
- icon
- description
- category (ROOM, HOTEL)

-- 11. AUDIT_LOG (General)
- id (PK)
- user_id (FK)
- action
- entity_type
- entity_id
- old_value (JSON)
- new_value (JSON)
- created_at
- ip_address
```

### 3.2 Mối Quan Hệ Giữa Các Bảng

```
USERS (1) ──→ (many) BOOKINGS
USERS (1) ──→ (many) REVIEWS
USERS (1) ──→ (many) PAYMENTS
USERS (many) ──→ (many) ROLES (through USER_ROLES)

HOTELS (1) ──→ (many) ROOMS
HOTELS (1) ──→ (many) BOOKINGS
HOTELS (1) ──→ (many) REVIEWS
HOTELS (1) ──→ (many) ROOM_AVAILABILITY

ROOMS (1) ──→ (many) BOOKINGS
ROOMS (1) ──→ (many) ROOM_AVAILABILITY

BOOKINGS (1) ──→ (many) PAYMENTS
BOOKINGS (1) ──→ (1) REVIEWS
```

---

## 4. LUỒNG HOẠT ĐỘNG CHÍNH

### 4.1 Luồng Đặt Phòng
1. Người dùng tìm kiếm phòng trống (Booking Service → Hotel Service)
2. Xác nhận thông tin khách (User Service)
3. Tạo đặt phòng (Booking Service)
4. Xử lý thanh toán (Payment Service)
5. Cập nhật trạng thái phòng (Hotel Service)
6. Gửi xác nhận email

### 4.2 Luồng Hủy Phòng
1. Người dùng yêu cầu hủy (Booking Service)
2. Kiểm tra chính sách hủy
3. Xử lý hoàn tiền (Payment Service)
4. Cập nhật trạng thái booking (Booking Service)
5. Cập nhật trạng thái phòng (Hotel Service)

### 4.3 Luồng Đánh Giá
1. Người dùng gửi đánh giá (Hotel Service)
2. Kiểm duyệt đánh giá
3. Cập nhật rating khách sạn
4. Gửi thông báo cho chủ khách sạn

---

## 5. CÔNG NGHỆ GIAO TIẾP GIỮA SERVICES

### 5.1 Synchronous Communication
- **REST API** với Spring RestTemplate hoặc Feign Client
- Sử dụng cho những tác vụ yêu cầu phản hồi ngay lập tức

### 5.2 Asynchronous Communication (Optional)
- **RabbitMQ/Kafka** cho các sự kiện không yêu cầu phản hồi tức thì
- Ví dụ: Gửi email xác nhận, cập nhật audit log

---

## 6. SECURITY & AUTHENTICATION

- **JWT (JSON Web Token)** cho authentication
- **OAuth 2.0** (tùy chọn) cho third-party integration
- **HTTPS** cho tất cả communication
- **Role-Based Access Control (RBAC)** cho authorization
- **Password Hashing** với bcrypt

---

## 7. PHÁT TRIỂN TỪNG GIAI ĐOẠN

### Phase 1: Setup Cơ Bản
- [ ] Tạo project structure
- [ ] Cấu hình Maven dependencies
- [ ] Setup Eureka Server
- [ ] Setup API Gateway

### Phase 2: Core Services
- [ ] User Service (with JWT)
- [ ] Hotel Service
- [ ] Booking Service
- [ ] Payment Service

### Phase 3: Advanced Features
- [ ] Review Service
- [ ] Notification Service
- [ ] Analytics Service
- [ ] Caching Layer (Redis - tùy chọn)

### Phase 4: DevOps & Deployment
- [ ] Docker containerization
- [ ] CI/CD Pipeline
- [ ] Monitoring & Logging (ELK Stack - tùy chọn)
- [ ] Performance Testing

---

## 8. DEPLOYMENT STRUCTURE

```
khachsan-microservices/
├── config-server/              # Centralized Configuration
├── eureka-server/              # Service Discovery
├── api-gateway/                # API Gateway
├── user-service/               # User Management
├── hotel-service/              # Hotel Management
├── booking-service/            # Booking Management
├── payment-service/            # Payment Processing
├── common/                      # Shared DTOs & Utils
└── docker-compose.yml          # Docker Setup
```

---

## 9. KỲ VỌNG HOÀN THÀNH

- **Tuần 1-2**: Setup kiến trúc cơ bản
- **Tuần 3-4**: Phát triển User & Hotel Service
- **Tuần 5-6**: Phát triển Booking & Payment Service
- **Tuần 7-8**: Testing, optimization, documentation
