HUONG DAN CHAY HE THONG KHACH SAN MICROSERVICES

BUOC 1: CHUAN BI MOI TRUONG

Kiem tra Java version:
java -version

(Can Java 23)

Kiem tra Maven:
mvn --version

(Can Maven 3.6+)

Kiem tra MySQL:
mysql --version

BUOC 2: SETUP DATABASE

Tuy chon A: Dung phpMyAdmin

1. Mo tro duyet web, truy cap http://localhost:8888/phpmyadmin
2. Dang nhap voi user root
3. Chon tab "SQL" tren cung
4. Mo file database-init.sql voi text editor
5. Sao chep toan bo noi dung
6. Dan vao tab SQL trong phpMyAdmin
7. Nhan nut "Go" hoac "Execute"
8. Cho den khi thay "Query executed successfully"

Tuy chon B: Dung MySQL Command Line (Windows PowerShell)

1. Mo PowerShell
2. Chay lenh:
   mysql -u root -p < D:\Spring_BTL\KhachSan\database-init.sql
3. Nhap password (neu co), neu khong co mat khau thi bam Enter

Tuy chon C: Dung MySQL Workbench (neu co)

1. Mo MySQL Workbench
2. File > Open SQL Script
3. Chon file database-init.sql
4. Nhan nut Execute

BUOC 3: BUILD COMMON LIBRARY

Tuy chon A: Dung IntelliJ IDEA (Recommended)

1. Mo IntelliJ IDEA
2. File > Open
3. Chon folder D:\Spring_BTL\KhachSan
4. Chon "Trust Project" neu co prompt
5. Cho IntelliJ index files (tren thanh status bar)
6. Mo Maven panel:
   - View > Tool Windows > Maven
   - Hoac: Ctrl + Alt + M
7. Trong Maven panel, mo tree: KhachSan > khachsan-common
8. Double-click: common > clean (chay clean)
9. Sau do double-click: common > install (chay install)
10. Cho den khi Console hien "BUILD SUCCESS"

Tuy chon B: Dung Command Line

1. Mo PowerShell
2. Chay lenh:
   cd D:\Spring_BTL\KhachSan\common
   mvn clean install

(Cho den khi thay "BUILD SUCCESS")

BUOC 4: CHAY CAC SERVICES

QUAN TRONG: Neu chay trong IntelliJ, co the chay cung trong 1 IDE nhung trong cac Terminal tab khac nhau

CACH 1: CHAY TRONG INTELLIJ IDEA (Recommended)

Setup chung:
1. Mo project trong IntelliJ
2. File > Project Structure > Project
3. Kiem tra SDK (Java 23)
4. OK

Chay API Gateway trong IntelliJ:

1. Mo folder api-gateway trong Project tree
2. Tim file: api-gateway/src/main/java/dh13c8/gateway/ApiGatewayApplication.java
3. Right-click vao file ApiGatewayApplication.java
4. Chon "Run 'ApiGatewayApplication'"
5. Terminal phai hien: "Started ApiGatewayApplication in X.XXX seconds"
6. Hoac click vao nut Play tren thanh toolbar (neu hien)

Chay User Service trong IntelliJ:

1. Mo folder user-service trong Project tree
2. Tim file: user-service/src/main/java/dh13c8/user/UserServiceApplication.java
3. Right-click vao file UserServiceApplication.java
4. Chon "Run 'UserServiceApplication'"
5. Neu muon chay cung luc voi service khac:
   - Run > Edit Configurations
   - Chon UserServiceApplication
   - Nhan nut Play hoac Shift+F10
   - Chon "Run" o dialog

Chay Hotel Service:

1. Mo folder hotel-service
2. Tim file: hotel-service/src/main/java/dh13c8/hotel/HotelServiceApplication.java
3. Right-click > "Run 'HotelServiceApplication'"
4. Terminal hien start message

Chay Booking Service:

1. Mo folder booking-service
2. Tim file: booking-service/src/main/java/dh13c8/booking/BookingServiceApplication.java
3. Right-click > "Run 'BookingServiceApplication'"

Chay Payment Service:

1. Mo folder payment-service
2. Tim file: payment-service/src/main/java/dh13c8/payment/PaymentServiceApplication.java
3. Right-click > "Run 'PaymentServiceApplication'"

Chay Review Service:

1. Mo folder review-service
2. Tim file: review-service/src/main/java/dh13c8/review/ReviewServiceApplication.java
3. Right-click > "Run 'ReviewServiceApplication'"

CACH 2: CHAY CAC SERVICES CUNG LUC (Compound Run Configuration)

1. Run > Edit Configurations
2. Nhan nut "+" de tao configuration moi
3. Chon "Compound"
4. Dat ten: "All Services"
5. Chon cac services:
   - Check: ApiGatewayApplication
   - Check: UserServiceApplication
   - Check: HotelServiceApplication
   - Check: BookingServiceApplication
   - Check: PaymentServiceApplication
   - Check: ReviewServiceApplication
6. OK
7. Chon "All Services" tu dropdown
8. Nhan nut Play
9. Tat ca services se chay cung luc

CACH 3: CHAY INDIVIDUAL SERVICES TRONG SEPARATE TERMINALS

1. Chon tab Terminal trong IntelliJ (duoi cung man hinh)
2. New Terminal: Ctrl + Shift + Backtick
3. Chay:
   cd api-gateway
   mvn spring-boot:run

4. Tab Terminal khac: Ctrl + Shift + Backtick
5. Chay:
   cd ../user-service
   mvn spring-boot:run

6. Lap lai cho cac service khac

DEBUG VA LOGGING

Xem logs trong Console cua IntelliJ khi chay service:
- Run > Show Running List (để xem cac services dang chay)
- Debug tool window de xem breakpoints

Neu muon Debug:
1. Right-click vao file Application.java
2. Chon "Debug 'ServiceApplication'"
3. Dat breakpoints bang F9
4. Chay va debug

DUNG SERVICES

Cach 1: Nhan nut Stop (nut dung trong toolbar)
- Chon service trong Console
- Nhan nut Stop (icon vuong do)

Cach 2: Ctrl+C trong Terminal

Cach 3: Dung IDE
- Run > Stop (Ctrl+F2)

CACH 4: CHAY BANG COMMAND LINE (Neu chi chay 1 service)

Mo Terminal trong IntelliJ:
1. View > Tool Windows > Terminal
2. Chay:
   cd api-gateway
   mvn spring-boot:run

3. Hoac bang graddle (neu co):
   ./gradlew bootRun

BUOC 5: KIEM TRA HE THONG

Khi tat ca cac services da chay, test API:

Test API Gateway:

Mo PowerShell tab 7, chay:
curl http://localhost:8000/api/auth/login

(Neu thay response JSON thi API Gateway hoat dong)

Test User Service:

curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@example.com\",\"password\":\"password123\"}"

Neu thanh cong thi se tra ve JWT token.

BUOC 6: DUNG CAC SERVICES

Khi muon dung:

1. An Ctrl+C o moi terminal chay service
2. Chay se dung va tro ve prompt

NHUNG VAN DE THUONG GAP

Van de: Port da duoc su dung
Giai phap:
- Kiem tra co service nao khac dang chay o port 8000-8005 khong
- Hoac sua port trong application.yml:
  server:
    port: 8001  (thay doi con so)

Van de: Khong the ket noi database
Giai phap:
- Kiem tra MySQL server da chay
- Kiem tra database-init.sql da chay thanh cong
- Kiem tra username/password trong application.yml

Van de: BUILD FAILURE
Giai phap:
- Xoa folder target: rm -r target
- Chay lai: mvn clean install

Van de: Khong thay JWT token sau khi dang nhap
Giai phap:
- Kiem tra user Service co chay khong
- Kiem tra log co loi khong
- Kiem tra database co user khong

DUNG GOI POSTMAN DE TEST

Neu muon test gon hon, su dung Postman:

1. Tai Postman tu https://www.postman.com/downloads/
2. Import file khachsan-api.postman_collection.json (neu co)
3. Chay cac test case tu collection

CAI DAT THU CONG VOI CURL (Advanced)

Dang ky user:

curl -X POST http://localhost:8000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"new@example.com\",\"password\":\"password123\",\"fullName\":\"New User\",\"phoneNumber\":\"0987654321\",\"address\":\"123 St\",\"city\":\"HCMC\",\"country\":\"Vietnam\"}"

Dang nhap:

curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@example.com\",\"password\":\"password123\"}"

Lay thong tin user:

curl -X GET http://localhost:8000/api/users/1 ^
  -H "Authorization: Bearer {token}"

(Thay {token} bang JWT token tu dang nhap)

CAP NHAT THONG TIN USER:

curl -X PUT http://localhost:8000/api/users/1 ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer {token}" ^
  -d "{\"fullName\":\"Updated Name\",\"phoneNumber\":\"0123456789\"}"

MONITORING VA LOGGING

Xem logs trong terminal se hien thi tat ca hoat dong cua service.

Log levels:
- ERROR: Loi nghiem trong
- WARN: Canh bao
- INFO: Thong tin chung
- DEBUG: Chi tiet loi

Cau hinh logging trong application.yml:
logging:
  level:
    root: INFO
    dh13c8: DEBUG

RESET LAI MU HDBNGHIEN

Xoa database va tao moi:

1. Dang nhap MySQL:
   mysql -u root -p

2. Chay:
   DROP DATABASE KhachSan;

3. Chay lai database-init.sql

4. Restart tat ca services

GIAO DIEN API CHI TIET

Xem file PLAN_CHI_TIET.md phan "PHAN 4: CAC TINH NANG CHINH" de biet chi tiet ve tung endpoint.

TIEP THEO

Sau khi he thong chay thanh cong:
1. Them nhieu endpoints trong Hotel, Booking, Payment, Review services
2. Them authentication checks trong controllers
3. Them validation cho input data
4. Them unit tests
5. Them integration tests

---

Ghi chu: Danh dau nay dung cho Windows PowerShell. Tren Linux/Mac hay thay doi cac lenh tuong ung.
