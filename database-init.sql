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

-- ============================================================
-- CAP NHAT DU LIEU 25 KHACH SAN VA PHONG (HOTEL-SERVICE)
-- ============================================================
USE KhachSan;

-- 1. Bo sung cot image_url cho bang hotels
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) DEFAULT NULL;

-- 2. Cap nhat hinh anh cho khach san so 1 mac dinh
UPDATE hotels
SET description = 'Khách sạn 5 sao sang trọng bậc nhất ngay trung tâm Quận 1 với tầm nhìn toàn cảnh thành phố.',
    city = 'Hồ Chí Minh',
    image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
WHERE id = 1;

-- 3. Them 24 khach san & resort trai deu 6 thanh pho
INSERT INTO hotels (hotel_name, description, owner_id, address, city, country, phone_number, email, check_in_time, check_out_time, star_rating, total_rooms, available_rooms, image_url, status)
VALUES
    ('Hanoi Heritage Hotel & Spa', 'Nằm ngay khu vực Phố Cổ và Hồ Hoàn Kiếm, mang phong cách kiến trúc Đông Dương tinh tế.', 3, '88 Hàng Trống, Hoàn Kiếm', 'Hà Nội', 'Vietnam', '024 3888 9999', 'booking@hanoiheritage.vn', '14:00:00', '12:00:00', 5, 60, 18, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 'ACTIVE'),
    ('Danang My Khe Beach Resort', 'Khu nghỉ dưỡng 4 sao sát biển Mỹ Khê với hồ bơi vô cực và bãi biển riêng tuyệt đẹp.', 3, '120 Võ Nguyên Giáp, Sơn Trà', 'Đà Nẵng', 'Vietnam', '0236 3777 888', 'info@danangbeach.vn', '14:00:00', '11:00:00', 4, 80, 25, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 'ACTIVE'),
    ('Dalat Pine Valley Boutique', 'Khách sạn nằm giữa đồi thông lãng mạn, không khí trong lành, cách chợ đêm Đà Lạt 5 phút di chuyển.', 3, '45 Trần Hưng Đạo, Phường 10', 'Đà Lạt', 'Vietnam', '0263 3555 666', 'contact@dalatpine.vn', '14:00:00', '11:30:00', 3, 35, 12, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'ACTIVE'),
    ('Nha Trang Ocean View Hotel', 'Tọa lạc trên con đường vàng Trần Phú, 100% các phòng đều có ban công hướng thẳng ra vịnh Nha Trang.', 3, '78 Trần Phú, Lộc Thọ', 'Nha Trang', 'Vietnam', '0258 3999 111', 'stay@nhatrangocean.vn', '14:00:00', '12:00:00', 4, 100, 40, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'ACTIVE'),
    ('Phu Quoc Sunset Villa & Resort', 'Thiên đường nghỉ dưỡng 5 sao tại Bãi Trường, nơi ngắm hoàng hôn đẹp nhất đảo ngọc Phú Quốc.', 3, 'Bãi Trường, Dương Tơ', 'Phú Quốc', 'Vietnam', '0297 3666 888', 'resort@phuquocsunset.vn', '15:00:00', '12:00:00', 5, 45, 8, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 'ACTIVE'),
    ('Westlake Boutique Hanoi', 'Khách sạn yên tĩnh ven Hồ Tây, phù hợp cho cả khách đi công tác và du lịch nghỉ dưỡng.', 3, '15 Quảng An, Tây Hồ', 'Hà Nội', 'Vietnam', '024 3719 5555', 'hello@westlakeboutique.vn', '14:00:00', '12:00:00', 4, 30, 10, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'ACTIVE'),
    ('Sofitel Legend Metropole Hanoi', 'Biểu tượng khách sạn 5 sao lịch sử giữa lòng Hà Nội với kiến trúc Pháp cổ điển sang trọng.', 3, '15 Ngô Quyền, Hoàn Kiếm', 'Hà Nội', 'Vietnam', '024 3826 6919', 'metropole@hanoihotel.vn', '14:00:00', '12:00:00', 5, 120, 32, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 'ACTIVE'),
    ('Lotte Center Skyview Hotel', 'Tọa lạc tại tầng cao tòa tháp Lotte với tầm nhìn 360 độ ngắm toàn cảnh thủ đô Hà Nội về đêm.', 3, '54 Liễu Giai, Ba Đình', 'Hà Nội', 'Vietnam', '024 3333 1000', 'skyview@lottehanoi.vn', '14:00:00', '12:00:00', 5, 90, 20, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 'ACTIVE'),
    ('Old Quarter Cozy Boutique', 'Khách sạn boutique ấm cúng ngay phố Tạ Hiện, thuận tiện khám phá ẩm thực đường phố.', 3, '22 Lương Ngọc Quyến, Hoàn Kiếm', 'Hà Nội', 'Vietnam', '024 3926 1234', 'cozy@oldquarter.vn', '14:00:00', '11:30:00', 3, 25, 9, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 'ACTIVE'),
    ('InterContinental Danang Sun Peninsula', 'Khu nghỉ dưỡng 5 sao đẳng cấp thế giới ẩn mình trên bán đảo Sơn Trà với bãi biển riêng biệt.', 3, 'Bãi Bắc, Bán đảo Sơn Trà', 'Đà Nẵng', 'Vietnam', '0236 3938 888', 'luxury@danangsun.vn', '15:00:00', '12:00:00', 5, 150, 40, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'ACTIVE'),
    ('Han River Dragon Bridge Hotel', 'Nằm ngay bờ sông Hàn, view trực diện Cầu Rồng phun lửa vào mỗi dịp cuối tuần.', 3, '102 Bạch Đằng, Hải Châu', 'Đà Nẵng', 'Vietnam', '0236 3654 321', 'dragon@hanriver.vn', '14:00:00', '12:00:00', 4, 70, 18, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', 'ACTIVE'),
    ('Non Nuoc Marble Mountain Resort', 'Resort sinh thái yên bình dưới chân danh thắng Ngũ Hành Sơn và bãi biển Non Nước.', 3, '68 Trường Sa, Ngũ Hành Sơn', 'Đà Nẵng', 'Vietnam', '0236 3959 595', 'booking@nonnuocresort.vn', '14:00:00', '11:00:00', 4, 55, 15, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', 'ACTIVE'),
    ('The Reverie Saigon Times Square', 'Khách sạn 5 sao xa hoa lộng lẫy ngay phố đi bộ Nguyễn Huệ và đường Đồng Khởi.', 3, '22-36 Nguyễn Huệ, Quận 1', 'Hồ Chí Minh', 'Vietnam', '028 3823 6688', 'reverie@saigonhotel.vn', '14:00:00', '12:00:00', 5, 110, 28, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 'ACTIVE'),
    ('Landmark 81 Cloud Suite Hotel', 'Trải nghiệm nghỉ dưỡng trên mây tại tòa nhà cao nhất Việt Nam, ngắm trọn sông Sài Gòn.', 3, '720A Điện Biên Phủ, Bình Thạnh', 'Hồ Chí Minh', 'Vietnam', '028 3971 8888', 'cloud@landmarkhotel.vn', '14:00:00', '12:00:00', 5, 95, 22, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 'ACTIVE'),
    ('Ben Thanh Central Boutique', 'Khách sạn hiện đại cách chợ Bến Thành chỉ 200m, cực kỳ thuận tiện mua sắm và giải trí.', 3, '45 Lê Thánh Tôn, Quận 1', 'Hồ Chí Minh', 'Vietnam', '028 3822 4455', 'info@benthanhcentral.vn', '14:00:00', '12:00:00', 3, 40, 14, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'ACTIVE'),
    ('Ana Mandara Villas Dalat Resort', 'Quần thể biệt thự cổ Pháp nằm ẩn mình trên đồi thông xanh mát, giữ nguyên nét kiến trúc thập niên 1920.', 3, 'Đường Lê Lai, Phường 5', 'Đà Lạt', 'Vietnam', '0263 3555 888', 'villas@dalatmandara.vn', '14:00:00', '12:00:00', 5, 50, 11, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'ACTIVE'),
    ('Tuyen Lam Lake Mist Resort', 'Khu nghỉ dưỡng ven hồ Tuyền Lâm thơ mộng, thức dậy giữa biển sương mù và rừng thông.', 3, 'Khu du lịch Hồ Tuyền Lâm', 'Đà Lạt', 'Vietnam', '0263 3800 999', 'mist@tuyenlamresort.vn', '14:00:00', '11:30:00', 4, 65, 19, 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800', 'ACTIVE'),
    ('Xuan Huong Lakeside Hotel', 'Nằm ngay bờ Hồ Xuân Hương và Quảng trường Lâm Viên, đi bộ 3 phút tới chợ đêm Đà Lạt.', 3, '12 Trần Quốc Toản, Phường 1', 'Đà Lạt', 'Vietnam', '0263 3511 222', 'stay@xuanhuonghotel.vn', '14:00:00', '12:00:00', 4, 45, 16, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', 'ACTIVE'),
    ('Vinpearl Luxury Hon Tre Island', 'Biệt thự biển 5 sao trên đảo Hòn Tre với hồ bơi riêng và cáp treo vượt biển độc đáo.', 3, 'Đảo Hòn Tre, Vĩnh Nguyên', 'Nha Trang', 'Vietnam', '0258 3598 999', 'luxury@hontreresort.vn', '14:00:00', '12:00:00', 5, 130, 35, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'ACTIVE'),
    ('Cam Ranh Riviera Beach Resort', 'Khu nghỉ dưỡng sát bãi Dài Cam Ranh với làn nước trong vắt và công viên nước nội khu.', 3, 'Bãi Dài, Cam Hải Đông', 'Nha Trang', 'Vietnam', '0258 3989 898', 'riviera@nhatrangbeach.vn', '14:00:00', '12:00:00', 5, 90, 27, 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', 'ACTIVE'),
    ('Agarwood Tower Hotel Nha Trang', 'Khách sạn ngay đối diện tháp Trầm Hương, trung tâm sôi động nhất thành phố biển.', 3, '36 Trần Phú, Lộc Thọ', 'Nha Trang', 'Vietnam', '0258 3522 666', 'info@agarwoodhotel.vn', '14:00:00', '12:00:00', 3, 50, 20, 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800', 'ACTIVE'),
    ('JW Marriott Phu Quoc Emerald Bay', 'Kiệt tác nghỉ dưỡng bên Bãi Kem với kiến trúc học viện cổ điển độc nhất vô nhị tại Phú Quốc.', 3, 'Bãi Kem, An Thới', 'Phú Quốc', 'Vietnam', '0297 3779 999', 'emerald@phuquocmarriott.vn', '15:00:00', '12:00:00', 5, 140, 30, 'https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800', 'ACTIVE'),
    ('Grand World Venice Canal Hotel', 'Khách sạn mang sắc màu Địa Trung Hải nằm dọc dòng kênh đào Venice tại Bắc Đảo Phú Quốc.', 3, 'Bãi Dài, Gành Dầu', 'Phú Quốc', 'Vietnam', '0297 3888 111', 'venice@grandworldpq.vn', '14:00:00', '12:00:00', 4, 85, 24, 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=800', 'ACTIVE'),
    ('Ong Lang Tropical Eco Resort', 'Bungalow ẩn mình giữa vườn nhiệt đới xanh mát sát biển Ông Lang yên bình.', 3, 'Bãi Ông Lang, Cửa Dương', 'Phú Quốc', 'Vietnam', '0297 3999 444', 'eco@onglangresort.vn', '14:00:00', '11:30:00', 4, 40, 12, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 'ACTIVE');

-- 4. Tu dong tao 3 hang phong (DOUBLE, DELUXE, SUITE) cho tat ca khach san tu so 2 tro di
INSERT IGNORE INTO rooms (hotel_id, room_number, room_type, capacity, price_per_night, description, max_guests, bed_type, floor_number, area_sqm, status)
SELECT id, '101', 'DOUBLE', 2, 850000, CONCAT('Phòng đôi tiêu chuẩn tiện nghi tại ', hotel_name), 2, 'DOUBLE_BED', 1, 32, 'AVAILABLE'
FROM hotels WHERE id > 1;

INSERT IGNORE INTO rooms (hotel_id, room_number, room_type, capacity, price_per_night, description, max_guests, bed_type, floor_number, area_sqm, status)
SELECT id, '201', 'DELUXE', 2, 1450000, CONCAT('Phòng Deluxe ban công hướng cảnh đẹp tại ', hotel_name), 3, 'KING_BED', 2, 45, 'AVAILABLE'
FROM hotels WHERE id > 1;

INSERT IGNORE INTO rooms (hotel_id, room_number, room_type, capacity, price_per_night, description, max_guests, bed_type, floor_number, area_sqm, status)
SELECT id, '301', 'SUITE', 4, 2600000, CONCAT('Phòng Suite cao cấp diện tích lớn tại ', hotel_name), 4, 'KING_BED', 3, 68, 'AVAILABLE'
FROM hotels WHERE id > 1;

COMMIT;
