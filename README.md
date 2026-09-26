KHACH SAN MICROSERVICES - HE THONG DAT PHONG KHACH SAN

Dau: Toan bo source code va tài lieu chi tiet de phat trien he thong dat phong khach san bang Microservices Architecture voi Spring Boot 2.7.x.

KIEN TRUC

He thong gom 6 Spring Boot microservices:

1. API Gateway (Port 8000)
   - Routing requests den cac services
   - Centralized entry point
   
2. User Service (Port 8001)
   - Quan ly users va authentication
   - JWT token generation
   - Dang ky, dang nhap, cap nhat thong tin
   
3. Hotel Service (Port 8002)
   - Quan ly khach san, phong, tien ich
   - Danh sach hotels va rooms
   
4. Booking Service (Port 8003)
   - Quan ly dat phong
   - Tim kiem phong trong
   - Huy phong
   
5. Payment Service (Port 8004)
   - Xu ly thanh toan
   - Hoa don
   - Hoang tien
   
6. Review Service (Port 8005)
   - Danh gia va ratings
   - Phe duyet reviews

TRUOC KHI BAT DAU

Yeu cau:
- Java 23 (Latest LTS-compatible)
- Maven 3.6+
- MySQL 8.0 / MariaDB 10.5+
- Git

Setup Database:

1. Tao database:
   - Truy cap phpMyAdmin: http://localhost:8888/phpmyadmin
   - Tab SQL, sao chep toan bo noi dung file database-init.sql
   - Chay script

2. Hoac dung MySQL CLI:
   mysql -u root -p < database-init.sql

CHI TIET DATABASE: xem file DATABASE_SETUP.md

CACH CHAY HE THONG

Cach 1: Chay Individual Services (Recommended)

1. Chay Common Library:
   cd common
   mvn clean install

2. Chay API Gateway:
   cd api-gateway
   mvn spring-boot:run

3. Chay User Service (PowerShell dung khong):
   cd user-service
   mvn spring-boot:run

4. Chay Hotel Service (terminal khac):
   cd hotel-service
   mvn spring-boot:run

5. Chay Booking Service (terminal khac):
   cd booking-service
   mvn spring-boot:run

6. Chay Payment Service (terminal khac):
   cd payment-service
   mvn spring-boot:run

7. Chay Review Service (terminal khac):
   cd review-service
   mvn spring-boot:run

Cach 2: Chay Parent POM

mvn clean install

Sau do chay tung service o tren.

TESTING API

Dung Postman hoac cURL de test API.

Postman Collection: xem file khachsan-api.postman_collection.json

Endpoints chinh:

Authentication:
- POST http://localhost:8000/api/auth/register
- POST http://localhost:8000/api/auth/login

User:
- GET http://localhost:8000/api/users/{userId}
- PUT http://localhost:8000/api/users/{userId}
- POST http://localhost:8000/api/users/{userId}/change-password

Hotels:
- GET http://localhost:8000/api/hotels
- GET http://localhost:8000/api/hotels/{id}

Du Lieu Mau De Dang Ky:

{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phoneNumber": "0987654321",
  "address": "123 Test St",
  "city": "Ho Chi Minh",
  "country": "Vietnam"
}

Du Lieu Mau De Dang Nhap:

{
  "email": "customer@example.com",
  "password": "password123"
}

TAI KHOAN DEMO

Email: customer@example.com
Mat khau: password123
Loai: CUSTOMER

Email: admin@example.com
Mat khau: password123
Loai: ADMIN

Email: owner@example.com
Mat khau: password123
Loai: HOTEL_OWNER

THUC HIEN CHI TIET

1. Database Schema: PLAN_CHI_TIET.md, ARCHITECTURE.md
2. Thuc hien API endpoints chi tiet trong code

STRUCTURE THU MUC

khachsan-microservices/
├── common/                    (Shared DTOs, Entities, Utils)
├── api-gateway/              (Port 8000)
├── user-service/             (Port 8001)
├── hotel-service/            (Port 8002)
├── booking-service/          (Port 8003)
├── payment-service/          (Port 8004)
├── review-service/           (Port 8005)
├── database-init.sql         (Database initialization)
├── DATABASE_SETUP.md         (Database setup guide)
├── PLAN_CHI_TIET.md          (Detailed plan)
├── ARCHITECTURE.md           (Architecture overview)
└── pom.xml                   (Parent POM)

LOGS VA DEBUGGING

Tat ca logs duoc luu o terminal/console khi chay service.
Cau hinh logging trong application.yml cua tung service.

NHUNG TINH NANG CO TRONG HE THONG

- User management va authentication voi JWT
- Hotel va room search
- Booking management
- Payment processing
- Reviews va ratings
- Multi-service architecture
- REST API design
- Database transactions

NHUNG TINH NANG TRONG PHAT TRIEN TIEP THEO

- Eureka Service Discovery
- Hystrix Circuit Breaker
- Redis caching
- Message queue (RabbitMQ)
- Docker containers
- Kubernetes deployment
- Advanced security
- Email notifications
- SMS notifications
- Third-party payment integration

TROUBLESHOOTING

Loi: Connection refused to localhost:3306
- Giai phap: Kiem tra MySQL server co chay khong

Loi: Database does not exist
- Giai phap: Chay database-init.sql bang phpMyAdmin

Loi: Port already in use
- Giai phap: Thay doi port trong application.yml

Loi: JWT token invalid
- Giai phap: Kiem tra token het han hoac khong dung secret key

CAP NHAT VA MAINTAIN

Tuan tuan can kiem tra:
- Database backups
- Log files
- Performance metrics
- API response times
- User feedback


