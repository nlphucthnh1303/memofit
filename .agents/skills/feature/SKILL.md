---
name: feature
description: Phát triển tính năng mới tổng quát từ A-Z, kết nối chuỗi khảo sát thầm lặng, thiết kế API contracts, sinh mã nguồn tuần tự và kiểm thử toàn vẹn.
---

# Skill `/feature` — Phát Triển Tính Năng Mới Toàn Diện (End-to-End)

## 1. Mục Đích
Phát triển một tính năng mới theo quy trình end-to-end hoàn chỉnh: Cấp phát Feature Code -> Khảo sát thầm lặng -> Thiết kế DTO/API Contracts -> Triển khai 3 tầng (DB -> Logic -> UI) -> Kiểm thử xác minh.

---

## 2. Quy Trình Thực Thi 5 Bước

### Bước 1: Khởi Tạo Mã & Không Gian Tài Liệu
1. Chạy CLI cấp phát mã tính năng:
   ```bash
   python3 .agents/scripts/feature_db.py create --module "<MODULE>" --title "<Feature Title>"
   ```
2. Cập nhật trạng thái thành `In-Progress`:
   ```bash
   python3 .agents/scripts/feature_db.py update-status "<feature-code>" "In-Progress"
   ```

### Bước 2: Khảo Sát Thầm Lặng & Thiết Kế Contracts (Silent Survey)
1. Đọc schema DB hiện có, types, routes và existing patterns trong repo.
2. Thiết kế DTOs, API endpoints (chuẩn kebab-case RESTful), request/response structures trong `technical-spec.md`.

### Bước 3: Triển Khai Mã Nguồn Tuần Tự (Autonomous Execution)
1. Thực thi theo chu trình khép kín:
   - Database: Migration / Schema / Model
   - Backend: Repository -> Service -> Controller / Route
   - Frontend: DTO types -> API client service -> UI Component
2. Tuyệt đối tuân thủ Zero-Comment Policy và Strict UI Guardrails.

### Bước 4: Kiểm Thử Toàn Vẹn Hành Trình (Holistic Verification)
1. Chạy build, lint, và tests (ví dụ: `npm run build`, `npm test`).
2. Xác minh dữ liệu lưu trữ thực tế trong DB, hiển thị đúng trên UI, không dùng mock fallback.

### Bước 5: Hoàn Tất & Cập Nhật Changelog
1. Cập nhật trạng thái tính năng thành `Completed`:
   ```bash
   python3 .agents/scripts/feature_db.py update-status "<feature-code>" "Completed"
   ```
2. Điền chi tiết thay đổi vào `changelog.md`.
3. Báo cáo hoàn thành cho người dùng kèm danh sách file và link `file://`.
