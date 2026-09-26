# Backend Services & API Gateway - Hướng Dẫn Chi Tiết

## 📌 Tóm Tắt Nhanh

**Câu hỏi:** Khi chạy `npm run dev` frontend, có cần chạy các backend services không?

**Trả lời:** **CÓ - BẠN PHẢI CHẠY CÁC BACKEND SERVICES!**

Frontend là phần giao diện. Để nó hoạt động, bạn cần dữ liệu từ backend. Nếu không có backend, frontend sẽ:
- ❌ Không thể đăng ký/đăng nhập
- ❌ Không thể xem danh sách khách sạn
- ❌ Không thể đặt phòng
- ❌ Không thể lưu dữ liệu

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────┐
│         React Frontend (Port 3000)              │
│    npm run dev                                  │
└──────────────────┬──────────────────────────────┘
                   │ (HTTP Requests)
                   ↓
┌─────────────────────────────────────────────────┐
│    API Gateway (Port 8000) - ĐIỂM VÀO          │
│    Tất cả requests từ frontend đi qua đây       │
└──────────────────┬──────────────────────────────┘
                   │ (Routes requests)
     ┌─────────────┼─────────────┬──────────────┐
     ↓             ↓             ↓              ↓
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│ User    │ │ Hotel   │ │ Booking  │ │ Payment  │
│ Service │ │ Service │ │ Service  │ │ Service  │
│Port 8001│ │Port 8002│ │Port 8003 │ │Port 8004 │
└────┬────┘ └────┬────┘ └────┬─────┘ └────┬─────┘
     │           │           │            │
     └───────────┼───────────┼────────────┘
                 ↓           ↓
            ┌──────────────────────┐
            │   MySQL Database     │
            │   (Port 3306)        │
            └──────────────────────┘
```

---

## 📦 Các Modules/Folders & Mục Đích

### 1️⃣ **common/** - KHÔNG CHẠY RIÊNG
```
Mục đích: Thư viện chung cho tất cả services
Chứa: DTO, Entity, Exception, Utility, JWT Utils
Cách dùng: Build thành JAR rồi dùng trong các services khác
Chạy: mvn install -f common/pom.xml (build & install vào local)
```

### 2️⃣ **api-gateway/** - PHẢI CHẠY ⭐⭐⭐
```
Cổng vào cho tất cả requests từ frontend
Port: 8000
Công việc:
  - Nhận request từ frontend
  - Route đến service thích hợp
  - Quản lý CORS (cho phép frontend gọi API)
  - Xác thực JWT token

Cách chạy:
  Right-click ApiGatewayApplication.java → Run
```

### 3️⃣ **user-service/** - PHẢI CHẠY ⭐
```
Chức năng: Xử lý user accounts
Port: 8001
Endpoints:
  POST /api/auth/register - Đăng ký
  POST /api/auth/login - Đăng nhập
  GET /api/users/{id} - Lấy thông tin user
  PUT /api/users/{id} - Cập nhật user
  POST /api/users/{id}/change-password - Đổi mật khẩu

Cách chạy:
  Right-click UserServiceApplication.java → Run
```

### 4️⃣ **hotel-service/** - PHẢI CHẠY ⭐
```
Chức năng: Quản lý khách sạn và phòng
Port: 8002
Endpoints:
  GET /api/hotels - Danh sách khách sạn
  GET /api/hotels/{id} - Chi tiết khách sạn
  GET /api/rooms - Danh sách phòng
  GET /api/rooms/{id} - Chi tiết phòng
  POST /api/reviews - Tạo đánh giá
  GET /api/reviews/hotel/{id} - Danh sách đánh giá

Cách chạy:
  Right-click HotelServiceApplication.java → Run
```

### 5️⃣ **booking-service/** - PHẢI CHẠY ⭐
```
Chức năng: Xử lý đặt phòng
Port: 8003
Endpoints:
  POST /api/bookings - Tạo booking
  GET /api/bookings/{id} - Chi tiết booking
  PUT /api/bookings/{id}/cancel - Hủy booking

Cách chạy:
  Right-click BookingServiceApplication.java → Run
```

### 6️⃣ **payment-service/** - PHẢI CHẠY ⭐
```
Chức năng: Xử lý thanh toán
Port: 8004
Endpoints:
  POST /api/payments - Thanh toán
  GET /api/payments/{id} - Chi tiết thanh toán

Cách chạy:
  Right-click PaymentServiceApplication.java → Run
```

---

## 🚀 HƯỚNG DẪN CHẠY - BẮT BUỘC

### Bước 1: Build Common Library
```bash
cd d:\Spring_BTL\KhachSan
mvn install -f common/pom.xml
```
✅ Điều này install common library vào local repository

### Bước 2: Chạy API Gateway & Services trong IntelliJ

Mở IntelliJ và chạy các services sau **cùng lúc** (trong 6 terminal hoặc 6 run configurations):

**Terminal 1 - API Gateway (QUAN TRỌNG NHẤT):**
```
Right-click: api-gateway/src/main/java/.../ApiGatewayApplication.java
→ Run 'ApiGatewayApplication'
```

**Terminal 2 - User Service:**
```
Right-click: user-service/src/main/java/.../UserServiceApplication.java
→ Run 'UserServiceApplication'
```

**Terminal 3 - Hotel Service:**
```
Right-click: hotel-service/src/main/java/.../HotelServiceApplication.java
→ Run 'HotelServiceApplication'
```

**Terminal 4 - Booking Service:**
```
Right-click: booking-service/src/main/java/.../BookingServiceApplication.java
→ Run 'BookingServiceApplication'
```

**Terminal 5 - Payment Service:**
```
Right-click: payment-service/src/main/java/.../PaymentServiceApplication.java
→ Run 'PaymentServiceApplication'
```

### Bước 3: Kiểm Tra Backend Chạy Thành Công
```bash
# Mở terminal riêng, test API Gateway
curl http://localhost:8000/api/hotels
```

Nếu nhận được JSON response → ✅ Backend chạy tốt

### Bước 4: Chạy Frontend
```bash
# Terminal mới
cd d:\Spring_BTL\KhachSan\frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

### Bước 5: Test Frontend
- Mở browser → `http://localhost:3000`
- Thử đăng ký/đăng nhập
- Thử xem danh sách khách sạn

---

## ❓ CÂU HỎI THƯỜNG GẶP

### Q1: Nếu chỉ chạy frontend mà không chạy backend sẽ như thế nào?
```
A: Frontend sẽ:
- Hiển thị giao diện bình thường
- Nhưng khi bấm nút → Lỗi "Cannot connect to API"
- Không thể đăng ký, đăng nhập
- Không thể xem khách sạn
- Tất cả chức năng đều fail
```

### Q2: Phải chạy tất cả 5 services không? Không chạy một cái được không?
```
A: Tùy chức năng:
- Muốn đăng ký/đăng nhập → PHẢI chạy user-service
- Muốn xem khách sạn → PHẢI chạy hotel-service
- Muốn đặt phòng → PHẢI chạy booking-service
- Muốn thanh toán → PHẢI chạy payment-service
- API Gateway PHẢI chạy (là cổng vào)

Khuyến cáo: Chạy hết 5 cái để test đầy đủ chức năng
```

### Q3: Common folder làm gì? Có phải service không?
```
A: Common KHÔNG phải service
- Là thư viện chứa code dùng chung (DTO, Entity, Exception)
- Tất cả services import từ common
- Phải build nó trước: mvn install -f common/pom.xml
- Chỉ build, không chạy (không có Application.java)
```

### Q4: Port 8000, 8001, 8002... là gì?
```
A: Port là "cửa vào" của mỗi service:
- 8000: API Gateway (entry point)
- 8001: User Service
- 8002: Hotel Service
- 8003: Booking Service
- 8004: Payment Service

Frontend (3000) gọi API qua API Gateway (8000)
API Gateway route đến services cần thiết
```

### Q5: Nếu backend down thì frontend vẫn chạy được không?
```
A: Được, nhưng:
- Giao diện vẫn hiển thị
- Tất cả nút bấm → Lỗi
- Không có dữ liệu để hiển thị
- Như trang web không có internet
```

### Q6: Có thể chỉ chạy 1 terminal mà chạy cả 5 services không?
```
A: Có, dùng Docker Compose hoặc start scripts
Nhưng để hiện tại, dễ nhất là:
- Chạy từng service trong IntelliJ
- Hoặc chạy 5 terminal PowerShell riêng
```

---

## 📊 Bảng Tóm Tắt

| Folder | Loại | Port | Bắt Buộc | Chạy Cách |
|--------|------|------|----------|-----------|
| common | Library | - | Build | `mvn install -f common/pom.xml` |
| api-gateway | Service | 8000 | ✅ YES | Right-click → Run |
| user-service | Service | 8001 | ✅ YES | Right-click → Run |
| hotel-service | Service | 8002 | ✅ YES | Right-click → Run |
| booking-service | Service | 8003 | ✅ YES | Right-click → Run |
| payment-service | Service | 8004 | ✅ YES | Right-click → Run |
| frontend | React App | 3000 | ✅ YES | `npm run dev` |

---

## 🔍 KIỂM TRA SERVICES CHẠY ĐÚNG

Sau khi chạy tất cả services, kiểm tra:

```bash
# 1. API Gateway (cổng vào)
curl http://localhost:8000/api/hotels

# 2. User Service
curl http://localhost:8001/actuator/health

# 3. Hotel Service
curl http://localhost:8002/actuator/health

# 4. Booking Service
curl http://localhost:8003/actuator/health

# 5. Payment Service
curl http://localhost:8004/actuator/health
```

Nếu tất cả trả về 200 → ✅ Tất cả chạy tốt

---

## 📋 QUYUY TRÌNH CHẠY ĐẦYĐỦ

1. ✅ Mở MySQL → Tạo database
2. ✅ `mvn install -f common/pom.xml` (build common)
3. ✅ Chạy 5 services (api-gateway, user, hotel, booking, payment)
4. ✅ Kiểm tra `curl http://localhost:8000/api/hotels`
5. ✅ `npm run dev` (chạy frontend)
6. ✅ Mở `http://localhost:3000` → Test

---

## 💡 LƯU Ý QUAN TRỌNG

- **Frontend là giao diện, backend là xương sống**
- Frontend không thể hoạt động mà không có backend
- API Gateway là điểm vào duy nhất cho frontend
- Tất cả 5 services cần chạy để test đầy đủ

---

**Tóm lại: PHẢI CHẠY TẤT CẢ BACKEND SERVICES VỚI FRONTEND!**

Nếu chỉ chạy `npm run dev` mà không chạy backend → Frontend sẽ hiển thị nhưng không có dữ liệu, tất cả chức năng fail.
