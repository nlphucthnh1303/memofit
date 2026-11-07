# Implementation Plan: [FEAT-SYSTEM-001] - Tái Cấu Trúc Hệ Sinh Thái 3 Projects & Khởi Tạo Nền Tảng Học Tiếng Anh Duolingo-Style

- **Mã tính năng**: `FEAT-SYSTEM-001`
- **Mục tiêu tính năng**: Tái quy hoạch Workspace thành 3 sub-projects độc lập (`memofit-web` bằng React, `memofit-admin` bằng Angular 21, `memofit-api` bằng Express 5), mở rộng Schema DB, thiết lập RBAC và lộ trình triển khai tính năng học tiếng Anh chuẩn Duolingo.
- **Trạng thái**: `Planned`
- **Ngày tạo**: 2026-11-02

---

### 🎯 KHUYẾN NGHỊ CHẾ ĐỘ THỰC THI (TOKEN ECONOMY)
- **Độ phức tạp task**: 🔴 HIGH
- **Cấu hình tối ưu**: Model: Gemini 3.8 Flash (High) / Pro | Thinking: High
- **Lý do**: Tái cấu trúc phân vùng đa dự án (Multi-project Monorepo), đổi tên thư mục gốc, cập nhật `WORKSPACE.md`, mở rộng Prisma Schema với enum RBAC và các bảng Lộ trình/Video/Thanh toán, khởi tạo project React mới với Vite.

---

## 1. Phân Rã 5 Tầng (5-Layer Architectural Decomposition)

### Tầng 0: Bản Chất Nghiệp Vụ (Core Business Value)
Biến Memofit từ một công cụ ôn từ vựng đơn thuần thành **Nền tảng Tự học Tiếng Anh & Luyện Thi TOEIC toàn diện** với trải nghiệm game hóa (Gamification) đỉnh cao, hoạt họa sống động (Animations) phong cách Duolingo, kết hợp hệ thống quản trị nội dung CMS chuyên nghiệp và thanh toán tự động qua VietQR PayOS.

### Tầng 1: Quét Toàn Diện Phạm Vi (Scope Audit)
1. **Repository 1 (`memofit-web`)**: Khởi tạo mới hoàn toàn bằng **React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Rive/Lottie + Howler Audio**.
2. **Repository 2 (`memofit-admin`)**: Chuyển đổi từ `front-end/` hiện tại (Angular 21 SSR + Angular Material) thành Cổng quản trị phân quyền cho Admin/Staff.
3. **Repository 3 (`memofit-api`)**: Chuyển đổi từ `back-end/` hiện tại (Express 5 + Prisma), bổ sung RBAC middleware, routes `/api/v1/client/*` vs `/api/v1/admin/*`, và tích hợp PayOS SDK.
4. **Cơ sở dữ liệu (PostgreSQL)**: Mở rộng bảng `users` (`role`, `hearts`, `exp_points`), bổ sung các bảng `learning_paths`, `path_stages`, `interactive_videos`, `video_subtitles`, `subscription_orders`.

### Tầng 2: Cây Phụ Thuộc & Tác Động Lan Truyền (Dependency Graph)
- Đổi tên thư mục `front-end` và `back-end` sẽ ảnh hưởng đến:
  - Đường dẫn relative trong `WORKSPACE.md`.
  - Scripts khởi chạy dev server trong từng thư mục.
- Cập nhật Prisma Schema yêu cầu chạy `npx prisma migrate dev` và `npx prisma generate` trong `memofit-api`.

### Tầng 3: Giả Định Ngầm & Nguyên Nhân Gốc Rễ (Root Cause & Assumptions)
- *Giả định*: Angular 21 trong `front-end` hiện tại đã có sẵn các component `Collection`, `Vocabulary`, `Questions`, rất phù hợp để tái cấu trúc thành các trang quản trị CMS trên `memofit-admin` mà không lãng phí công sức đã code.
- *Nguyên nhân chọn React cho `memofit-web`*: React sở hữu hệ sinh thái `framer-motion` và `@rive-app/react-canvas` vượt trội, là điều kiện tiên quyết để tạo trải nghiệm mượt mà, đàn hồi và vui nhộn giống Duolingo.

### Tầng 4: Rủi Ro & Đánh Đổi (Risks & Trade-offs)
- *Rủi ro*: Xung đột port khi chạy cùng lúc cả 3 sub-projects trên local.
  - *Giải pháp*: Quy ước cố định port:
    - `memofit-api`: Port `5000` (hoặc `3000`)
    - `memofit-web`: Port `5173` (Vite dev server mặc định)
    - `memofit-admin`: Port `4200` (Angular dev server mặc định)
- *Rủi ro*: Đổi tên thư mục làm gián đoạn git history nếu không dùng `git mv`.
  - *Giải pháp*: Sử dụng lệnh shell an toàn hoặc di chuyển có kiểm soát.

### Tầng 5: Phân Kỳ Thực Thi 4 Giai Đoạn (Execution Phases)

---

## 2. Danh Sách File Cần Chỉnh Sửa / Tạo Mới (File Matrix)

| Đường dẫn file | Phân loại | Trách nhiệm chính |
|---|---|---|
| `WORKSPACE.md` | Sửa đổi | Cập nhật cấu hình 3 repositories: `memofit-web`, `memofit-admin`, `memofit-api` |
| `memofit-api/prisma/schema.prisma` | Sửa đổi | Bổ sung enum `user_role`, bảng lộ trình, video tương tác, đơn hàng thanh toán |
| `memofit-api/src/middleware/role.middleware.js` | Tạo mới | Chặn truy cập trái phép vào các endpoint `/api/v1/admin/*` |
| `memofit-api/src/routes/index.js` | Sửa đổi | Phân luồng router thành 2 nhánh: `/client` và `/admin` |
| `memofit-api/src/services/payos.service.js` | Tạo mới | Tích hợp SDK PayOS tạo mã VietQR và kiểm tra webhook |
| `memofit-admin/src/app/app.routes.ts` | Sửa đổi | Định tuyến lại các trang Angular thành Portal Quản trị (CMS) |
| `memofit-web/package.json` | Tạo mới | Khởi tạo dự án React (Vite, Tailwind, Framer Motion, Zustand, Lucide) |
| `memofit-web/src/App.tsx` | Tạo mới | Thiết lập Layout và Router chính cho web học viên |
| `memofit-web/src/features/roadmap/` | Tạo mới | Component bản đồ lộ trình 5 Ranks Duolingo-style |

---

## 3. Kế Hoạch Thực Thi Tuần Tự (Step-by-Step Execution Plan)

### Giai Đoạn 1: Quy Hoạch Thư Mục & Workspace Coordination
1. Đổi tên thư mục `back-end` $\rightarrow$ `memofit-api`.
2. Đổi tên thư mục `front-end` $\rightarrow$ `memofit-admin`.
3. Cập nhật [WORKSPACE.md](file:///home/thnh/Documents/Projects/memofit/WORKSPACE.md) phản ánh đúng vai trò và công nghệ của 3 projects.
4. Kiểm tra sức khỏe hệ thống và đảm bảo `feature_db.py` hoạt động bình thường.

### Giai Đoạn 2: Nâng Cấp Backend `memofit-api`
1. Cập nhật `prisma/schema.prisma`:
   - Thêm `enum user_role { USER, MODERATOR, ADMIN, SUPER_ADMIN }`.
   - Thêm bảng `learning_paths`, `path_stages`, `interactive_videos`, `video_subtitles`, `subscription_orders`.
2. Chạy migrate database.
3. Tạo middleware `role.middleware.js` kiểm tra quyền `ADMIN`.
4. Tạo cấu trúc thư mục route `src/routes/client/` và `src/routes/admin/`.
5. Tạo `payos.service.js` hỗ trợ sandbox thanh toán VietQR.

### Giai Đoạn 3: Khởi Tạo Dự Án `memofit-web` (React + Vite)
1. Khởi tạo template `memofit-web` bằng `npm create vite@latest memofit-web -- --template react-ts`.
2. Cài đặt các thư viện lõi:
   - `framer-motion` (animations & layout transitions)
   - `canvas-confetti` (hiệu ứng pháo hoa chúc mừng)
   - `lucide-react` (bộ icon cao cấp)
   - `zustand` (quản lý state: tim, streak, user)
   - `tailwindcss` & `@tailwindcss/vite`
   - `axios` (HTTP client kết nối `memofit-api`)
3. Xây dựng khung giao diện chính:
   - Header Gamified: Tim (Lives/Hearts), Lửa Streak, Điểm EXP, Nút mở khóa Pro.
   - Bản đồ lộ trình 5 Ranks: Các Node bài học uốn lượn có trạng thái Khóa / Đang học / Đã hoàn thành (Cúp vàng).
   - Micro-learning Engine: Màn hình làm bài tập có âm thanh phản hồi tức thì.

### Giai Đoạn 4: Chuyển Đổi `memofit-admin` (Angular 21)
1. Tái cấu trúc routing của Angular: Biến các màn hình hiện có thành CMS quản lý:
   - Trang quản lý học viên (`/admin/users`).
   - Trang quản trị lộ trình (`/admin/roadmaps`).
   - Trang duyệt câu hỏi AI (`/admin/questions`).
   - Trang thiết lập đề thi TOEIC (`/admin/exams`).
   - Trang nhật ký thanh toán (`/admin/payments`).

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification Checklist)

- [ ] `memofit-api` chạy ổn định trên port `5000` (`npm start`).
- [ ] Prisma schema migrate thành công, tạo tài khoản admin đầu tiên có `role = 'ADMIN'`.
- [ ] Route `/api/v1/admin/*` chặn được token học viên thông thường (`403 Forbidden`).
- [ ] `memofit-admin` (Angular) khởi chạy được trên port `4200` (`npm start`), đăng nhập được bằng tài khoản Admin.
- [ ] `memofit-web` (React) khởi chạy mượt mà trên port `5173` (`npm run dev`), hiển thị đầy đủ hiệu ứng animation, lộ trình Duolingo và kết nối API thành công.
