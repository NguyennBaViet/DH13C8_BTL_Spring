-- Khoi tao database KhachSan cho he thong dat phong
-- Script tao database va cac bang

DROP DATABASE IF EXISTS KhachSan;
CREATE DATABASE KhachSan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE KhachSan;

-- ============================================
-- Bang USERS - Luu thong tin nguoi dung
-- ============================================
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
    last_login TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang HOTELS - Luu thong tin khach san
-- ============================================
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
    INDEX idx_status (status),
    INDEX idx_owner_id (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang ROOMS - Luu thong tin phong
-- ============================================
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
    INDEX idx_room_type (room_type),
    UNIQUE KEY unique_room_number (hotel_id, room_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang AMENITIES - Luu danh sach tien ich
-- ============================================
CREATE TABLE amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    category ENUM('ROOM', 'HOTEL', 'PAYMENT') DEFAULT 'ROOM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang ROOM_AMENITIES - Lien ket phong voi tien ich
-- ============================================
CREATE TABLE room_amenities (
    room_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
    INDEX idx_room_id (room_id),
    INDEX idx_amenity_id (amenity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang ROOM_AVAILABILITY - Quan ly kha dung phong theo ngay
-- ============================================
CREATE TABLE room_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    price_override DECIMAL(10, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_available_date (available_date),
    INDEX idx_room_id (room_id),
    UNIQUE KEY unique_room_date (room_id, available_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang BOOKINGS - Luu thong tin dat phong
-- ============================================
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
    cancellation_date TIMESTAMP NULL DEFAULT NULL,
    cancellation_reason LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_number (booking_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang PAYMENTS - Luu thong tin thanh toan
-- ============================================
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'WALLET', 'CASH') NOT NULL,
    transaction_id VARCHAR(100),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date TIMESTAMP NULL DEFAULT NULL,
    refund_date TIMESTAMP NULL DEFAULT NULL,
    refund_amount DECIMAL(10, 2),
    receipt_url VARCHAR(500),
    notes LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang REVIEWS - Luu danh gia khach san
-- ============================================
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
    response_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_user_id (user_id),
    INDEX idx_review_status (review_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang PROMOTIONS - Luu khuyen mai va ma giam gia
-- ============================================
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
    INDEX idx_end_date (end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bang AUDIT_LOG - Ghi log hoat dong quan trong
-- ============================================
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
    INDEX idx_entity_type (entity_type),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Them du lieu mau (Sample Data)
-- ============================================

-- Insert amenities
INSERT INTO amenities (name, description, category) VALUES 
('WiFi', 'Free WiFi internet', 'ROOM'),
('Air Conditioning', 'Central air conditioning', 'ROOM'),
('TV', '32 inch television', 'ROOM'),
('Bathroom', 'Private bathroom', 'ROOM'),
('Mini Bar', 'In-room mini bar', 'ROOM'),
('Safe', 'In-room safe', 'ROOM'),
('Telephone', 'Direct telephone line', 'ROOM'),
('Pool', 'Swimming pool', 'HOTEL'),
('Gym', 'Fitness center', 'HOTEL'),
('Restaurant', 'On-site restaurant', 'HOTEL'),
('Bar', 'Hotel bar', 'HOTEL'),
('Concierge', '24/7 concierge service', 'HOTEL'),
('Parking', 'Free parking', 'HOTEL'),
('Credit Card', 'Credit card payment', 'PAYMENT'),
('Bank Transfer', 'Bank transfer payment', 'PAYMENT'),
('Cash', 'Cash payment', 'PAYMENT');

-- Insert demo user (customer)
INSERT INTO users (email, password_hash, full_name, phone_number, gender, address, city, country, status, user_type) 
VALUES ('customer@example.com', '$2a$10$dXJ3SW6G7P50eS3HqWAkCOYt6TZwWJy09g5rWR3JHd0iV8qypa5Ey', 'Nguyen Van A', '0123456789', 'MALE', '123 Main St', 'Ho Chi Minh', 'Vietnam', 'ACTIVE', 'CUSTOMER');

-- Insert demo user (admin)
INSERT INTO users (email, password_hash, full_name, phone_number, gender, status, user_type) 
VALUES ('admin@example.com', '$2a$10$dXJ3SW6G7P50eS3HqWAkCOYt6TZwWJy09g5rWR3JHd0iV8qypa5Ey', 'Admin User', '0987654321', 'MALE', 'ACTIVE', 'ADMIN');

-- Insert demo user (hotel owner)
INSERT INTO users (email, password_hash, full_name, phone_number, gender, status, user_type) 
VALUES ('owner@example.com', '$2a$10$dXJ3SW6G7P50eS3HqWAkCOYt6TZwWJy09g5rWR3JHd0iV8qypa5Ey', 'Hotel Owner', '0912345678', 'MALE', 'ACTIVE', 'HOTEL_OWNER');

-- Insert demo hotel
INSERT INTO hotels (hotel_name, description, owner_id, address, city, country, phone_number, email, check_in_time, check_out_time, star_rating, total_rooms, available_rooms, status)
VALUES ('Luxury Hotel', 'Beautiful 5-star hotel in the city center', 3, '456 Hotel Ave', 'Ho Chi Minh', 'Vietnam', '028 5555 5555', 'info@luxuryhotel.com', '14:00:00', '11:00:00', 5, 50, 45, 'ACTIVE');

-- Insert demo rooms
INSERT INTO rooms (hotel_id, room_number, room_type, capacity, price_per_night, max_guests, bed_type, floor_number, area_sqm, status)
VALUES 
(1, '101', 'SINGLE', 1, 500000, 1, 'SINGLE_BED', 1, 25, 'AVAILABLE'),
(1, '102', 'DOUBLE', 2, 800000, 2, 'DOUBLE_BED', 1, 35, 'AVAILABLE'),
(1, '103', 'TRIPLE', 3, 1200000, 3, 'TWIN_BEDS', 1, 45, 'AVAILABLE'),
(1, '201', 'SUITE', 2, 1500000, 4, 'KING_BED', 2, 55, 'AVAILABLE'),
(1, '202', 'DELUXE', 2, 2000000, 4, 'KING_BED', 2, 60, 'AVAILABLE');

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 7),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7);

-- Insert room availability for next 30 days
INSERT INTO room_availability (room_id, available_date, is_available) 
SELECT r.id, DATE_ADD(CURDATE(), INTERVAL n DAY), TRUE
FROM rooms r, (
    SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 
    UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 
    UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 
    UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29
) nums
WHERE r.hotel_id = 1;

-- Insert demo promotion
INSERT INTO promotions (promo_code, hotel_id, discount_type, discount_value, description, start_date, end_date, max_usage_count, min_stay_nights, status)
VALUES ('WELCOME10', 1, 'PERCENTAGE', 10, 'Welcome discount 10%', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 100, 1, 'ACTIVE');

COMMIT;
