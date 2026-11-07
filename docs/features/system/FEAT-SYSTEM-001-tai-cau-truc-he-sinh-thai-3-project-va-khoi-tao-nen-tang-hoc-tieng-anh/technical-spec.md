# Technical Specification: [FEAT-SYSTEM-001] - Tái Cấu Trúc Hệ Sinh Thái 3 Projects & Khởi Tạo Nền Tảng Học Tiếng Anh Duolingo-Style

- **Mã tính năng**: `FEAT-SYSTEM-001`
- **Tài liệu kế hoạch**: [plan.md](file:///home/thnh/Documents/Projects/memofit/docs/features/system/FEAT-SYSTEM-001-tai-cau-truc-he-sinh-thai-3-project-va-khoi-tao-nen-tang-hoc-tieng-anh/plan.md)

---

## 1. Sơ Đồ Kiến Trúc Hệ Sinh Thái 3 Dự Án (Ecosystem Architecture)

```mermaid
graph TD
    subgraph FrontendZone ["TẦNG FRONTEND"]
        Web["🌐 memofit-web (React + Vite)<br/>Port: 5173<br/>• Gamified UI (Hearts, Streaks, Confetti)<br/>• 5 Ranks Duolingo-style Roadmap<br/>• Dictation / Shadowing Player<br/>• Writing & TOEIC Practice Engine"]
        Admin["🛡️ memofit-admin (Angular 21)<br/>Port: 4200<br/>• User Management & Progression Audit<br/>• Content CMS (Roadmaps, Videos, Topics)<br/>• AI Questions Approval<br/>• Exams & PayOS Logs"]
    end

    subgraph BackendZone ["TẦNG BACKEND & LOGIC TRUNG TÂM"]
        API["🚀 memofit-api (Express 5)<br/>Port: 5000<br/>• Auth & JWT Token Manager<br/>• RBAC Middleware (Role: USER / ADMIN)<br/>• Client Routes (/api/v1/client/*)<br/>• Admin Routes (/api/v1/admin/*)"]
        Worker["⚙️ Background Workers<br/>• 00:00 Daily Streak Evaluator<br/>• Expired OTP Cleanup<br/>• PayOS Webhook Handler"]
    end

    subgraph DataZone ["TẦNG DỮ LIỆU & DỊCH VỤ NGOÀI"]
        PostgreSQL[("🐘 PostgreSQL (Prisma ORM)")]
        GeminiAI["✨ Google Gemini GenAI"]
        PayOS["💳 Cổng Thanh Toán PayOS (VietQR)"]
    end

    Web -->|Bearer JWT: Role USER| API
    Admin -->|Bearer JWT: Role ADMIN| API
    API --> PostgreSQL
    API --> Worker
    Worker --> PostgreSQL
    API --> GeminiAI
    API --> PayOS
```

---

## 2. Luồng Xử Lý Nghiệp Vụ Cốt Lõi (Core Sequence Flows)

### 2.1. Luồng Học Viên Hoàn Thành Bài Học Vượt Ải (Lesson Completion & Gamification Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học Viên
    participant Web as memofit-web (React)
    participant API as memofit-api (Express)
    participant DB as PostgreSQL (Prisma)

    Learner->>Web: Hoàn thành bài học tại Node lộ trình (VD: Unit 1)
    Web->>Web: Kích hoạt âm thanh thắng cuộc (victory.mp3) + Pháo hoa Canvas-Confetti
    Web->>API: POST /api/v1/client/lessons/complete { stageId, correctCount, timeSpentMs }
    API->>API: Tính toán điểm kinh nghiệm (EXP +20) & Cập nhật Streak
    API->>DB: UPDATE user_path_progress & UPDATE users (exp, streak)
    API-->>Web: Response 200 { newExp: 140, streak: 5, unlockedNextStageId: 102 }
    Web->>Web: Mở khóa Node tiếp theo trên bản đồ với hiệu ứng sáng bóng (Glow animation)
```

### 2.2. Luồng Thanh Toán Mua Gói Học Qua VietQR PayOS (Payment Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học Viên
    participant Web as memofit-web (React)
    participant API as memofit-api (Express)
    participant PayOS as Cổng Thanh Toán PayOS
    participant BankApp as App Ngân Hàng Học Viên

    Learner->>Web: Chọn gói "Pro Member 1 Năm"
    Web->>API: POST /api/v1/client/subscriptions/create-checkout { planId: 'PRO_YEAR' }
    API->>PayOS: Gọi PayOS API tạo Payment Link kèm mã đơn hàng
    PayOS-->>API: Trả về { checkoutUrl, qrCode, orderCode }
    API-->>Web: Trả về mã QR thanh toán VietQR
    Web->>Learner: Hiển thị Popup QR kèm đồng hồ đếm ngược 15 phút
    Learner->>BankApp: Quét mã QR và chuyển khoản
    BankApp->>PayOS: Giao dịch ngân hàng hoàn tất
    PayOS->>API: Webhook POST /api/v1/payments/webhook { orderCode, status: 'PAID' }
    API->>API: Xác thực chữ ký số Webhook PayOS
    API->>API: Nâng cấp tài khoản user lên role 'PRO_USER'
    API-->>Web: WebSocket / Polling báo thanh toán thành công
    Web->>Learner: Hiển thị màn hình chúc mừng mở khóa tài khoản Pro!
```

---

## 3. Đặc Tả Hợp Đồng API (API Contracts)

### 3.1. Phân Nhánh API Học Viên (`/api/v1/client/*`)

* `GET /api/v1/client/roadmap`: Trả về toàn bộ cây lộ trình 5 Ranks, danh sách Topics và trạng thái từng Node của học viên.
* `GET /api/v1/client/lessons/:id`: Trả về dữ liệu bài học (danh sách từ vựng, câu hỏi trắc nghiệm, bài tập viết).
* `POST /api/v1/client/lessons/:id/submit`: Nộp bài làm, tính điểm SM-2 và nhận thưởng EXP.
* `GET /api/v1/client/videos`: Danh sách video tương tác phục vụ Dictation & Shadowing.
* `GET /api/v1/client/videos/:id/subtitles`: Dữ liệu phụ đề theo mốc thời gian để làm bài chép chính tả.
* `POST /api/v1/client/subscriptions/create-checkout`: Khởi tạo đơn hàng thanh toán VietQR PayOS.

### 3.2. Phân Nhánh API Quản Trị (`/api/v1/admin/*`) — Yêu cầu Role `ADMIN`

* `GET /api/v1/admin/users`: Danh sách học viên, phân trang, lọc theo trạng thái tài khoản.
* `PUT /api/v1/admin/users/:id/status`: Khóa hoặc mở khóa tài khoản học viên.
* `POST /api/v1/admin/roadmaps/topics`: Tạo Topic mới cho một Rank.
* `POST /api/v1/admin/videos`: Tải lên video mới kèm file phụ đề VTT/SRT.
* `GET /api/v1/admin/questions/pending`: Danh sách câu hỏi AI tạo đang chờ duyệt.
* `PUT /api/v1/admin/questions/:id/approve`: Duyệt câu hỏi đưa vào kho đề chính thức.
* `GET /api/v1/admin/transactions`: Lịch sử giao dịch thanh toán gói học qua PayOS.

---

## 4. Đặc Tả Cơ Sở Dữ Liệu Bổ Sung (Prisma Schema Additions)

```prisma
enum user_role {
  USER
  PRO_USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

// Bảng đơn hàng thanh toán gói học
model subscription_orders {
  id              Int       @id @default(autoincrement())
  user_id         Int
  order_code      BigInt    @unique
  plan_type       String    @db.VarChar(50) // 'MONTHLY', 'YEARLY', 'LIFETIME'
  amount          Int
  status          String    @default("PENDING") @db.VarChar(50) // 'PENDING', 'PAID', 'CANCELLED'
  payos_payment_link_id String? @db.VarChar(255)
  created_at      DateTime  @default(now()) @db.Timestamp(6)
  paid_at         DateTime? @db.Timestamp(6)
  users           users     @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```
