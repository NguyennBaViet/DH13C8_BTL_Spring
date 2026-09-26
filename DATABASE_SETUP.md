# Huong dan cai dat Database

## 1. YEU CAU

- MySQL 8.0 hoac MariaDB 10.5+
- phpMyAdmin (dat tai localhost:8888)
- Quyen root tren MySQL server

## 2. CACH 1: Dung phpMyAdmin (Dung nhat)

### Buoc 1: Truy cap phpMyAdmin
- Mo tro duyet web
- Truy cap: http://localhost:8888/phpmyadmin
- Dang nhap voi user: root (khong co mat khau hoac dung mat khau hien tai)

### Buoc 2: Tao database moi
1. Nhan "SQL" o thanh menu tren cung
2. Sao chep toan bo noi dung file database-init.sql
3. Dan vao tab SQL
4. Nhan nut "Go" de chay script

### Buoc 3: Kiem tra ket qua
- Di den tab "Databases"
- Kiem tra co database "KhachSan" khong
- Nhan vao database, xem cac bang da tao

## 3. CACH 2: Dung MySQL Command Line (Advanced)

### Tren Windows PowerShell:

```powershell
# Dang nhap MySQL
mysql -u root -p

# Chay script (bat duoc khi dang nhap)
USE KhachSan;
source D:\Spring_BTL\KhachSan\database-init.sql;

# Hoac chay truc tiep
mysql -u root -p < D:\Spring_BTL\KhachSan\database-init.sql
```

### Tren Linux/Mac:

```bash
mysql -u root -p < /path/to/database-init.sql
```

## 4. KIEM TRA CO SO DU LIEU

### Xem cac bang da tao:

```sql
USE KhachSan;
SHOW TABLES;
```

Ket qua phai co 11 bang:
- users
- hotels
- rooms
- amenities
- room_amenities
- room_availability
- bookings
- payments
- reviews
- promotions
- audit_log

### Xem cau truc bang users:

```sql
DESCRIBE users;
```

### Xem du lieu mau:

```sql
SELECT * FROM users;
SELECT * FROM amenities;
SELECT * FROM hotels;
SELECT * FROM rooms;
SELECT * FROM promotions;
```

## 5. DU LIEU MAU DUOC THEM VAO

### Users:
- customer@example.com (password: password123 - BCrypt hash)
- admin@example.com (password: password123)
- owner@example.com (password: password123)

### Hotel:
- Luxury Hotel (5 star hotel o HCMC)
- 5 phong (Single, Double, Triple, Suite, Deluxe)
- Gia phong tu 500.000 den 2.000.000 VND

### Amenities:
- 16 tien ich (WiFi, Air Conditioning, Pool, Gym, etc.)

### Promotions:
- WELCOME10: Giam 10% gia phong

### Room Availability:
- Cac phong co san cho 30 ngay ke tu hom nay

## 6. CAU HINH APPLICATION.PROPERTIES

Trong file application.properties cua moi service:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/KhachSan
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## 7. RESET CO SO DU LIEU

Neu ban muon reset lai database (xoa het du lieu):

```sql
DROP DATABASE KhachSan;
```

Sau do chay lai script database-init.sql.

## 8. SAO CHEP DU LIEU TU PHPMYADMIN

1. Trong phpMyAdmin, chon database KhachSan
2. Tab "Export"
3. Chon "SQL" format
4. Nhan "Go" de tai xuong

## 9. LUU Y QUAN TRONG

- Password demo la: password123
- Hash: $2a$10$dXJ3SW6G7P50eS3HqWAkCOYt6TZwWJy09g5rWR3JHd0iV8qypa5Ey
- UTF-8 encoding cho tieng Viet
- AUTO_INCREMENT se tang tu 1
- Timestamps se tu cap nhat

## 10. TROUBLESHOOTING

### Loi: "Access denied for user 'root'@'localhost'"
- Kiem tra password MySQL
- Neu khong nho password, reset: mysql -u root --skip-password

### Loi: "Cannot drop database 'KhachSan'; database doesn't exist"
- Binh thuong, database chua ton tai
- Chay lai script, no se tao moi

### Loi: "Duplicate entry" khi them du lieu
- Xoa database va tao moi

## 11. PHAN MEMDB TOOLS

Cac cong cu huu ich:
- phpMyAdmin: GUI web-based
- MySQL Workbench: Desktop application
- DBeaver: Universal database tool
- HeidiSQL: Lightweight MySQL client
