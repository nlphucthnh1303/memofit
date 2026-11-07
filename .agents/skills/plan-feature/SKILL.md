---
name: plan-feature
description: Lập kế hoạch tính năng, tự động cấp phát mã FEAT-[MODULE]-[NUMBER] qua feature_db.py, thẩm định Token Tiering và lưu tại docs/features/. Tuyệt đối chưa sinh mã nguồn trong bước này.
---

# Skill `/plan-feature` — Lập Kế Hoạch Tính Năng & Cấp Phát Feature Code

## 1. Mục Đích
Khảo sát nghiệp vụ, tự động sinh mã `FEAT-[MODULE]-[NUMBER]`, thẩm định Token Tiering và xuất bản kế hoạch chuẩn tại `docs/features/[module]/[code]-[slug]/plan.md` kèm `technical-spec.md` và `changelog.md`.

---

## 2. Quy Trình Thực Thi 5 Bước

### Bước 1: Tự Động Cấp Phát Mã Định Danh Duy Nhất
Chạy lệnh CLI:
```bash
python3 .agents/scripts/feature_db.py create --module "<MODULE>" --title "<Feature Title>"
```
Lệnh này sẽ tự động:
- Cấp phát mã `FEAT-[MODULE]-[NUMBER]` mới (ví dụ: `FEAT-AUTH-002`).
- Tạo thư mục `docs/features/[module]/[feature-code]-[slug]/`.
- Khởi tạo mẫu `plan.md`, `technical-spec.md`, và `changelog.md`.
- Ghi nhận vào `docs/features/features-db.json`.

### Bước 2: Tư Duy Phản Biện & Phân Rã 5 Tầng (5-Layer Decomposition)
Chất vấn yêu cầu, loại bỏ tính năng thừa thãi (anti-slop) và phân rã:
1. **Tầng 0 (Bản chất nghiệp vụ)**: Xác định giá trị thực tế của tính năng.
2. **Tầng 1 (Quét toàn diện phạm vi)**: Kiểm kê DB, APIs, Frontend State, UI components.
3. **Tầng 2 (Cây phụ thuộc & Tác động lan truyền)**: Xác định các điểm gãy vỡ tiềm tàng.
4. **Tầng 3 (Nguyên nhân gốc rễ & Giả định ngầm)**: Đào sâu 5 Whys.
5. **Tầng 4 (Rủi ro & Đánh đổi)**: Must-have vs Nice-to-have.
6. **Tầng 5 (Phân kỳ thực thi)**: Chi tiết từng bước DB -> Logic -> UI -> E2E verify.

### Bước 3: Đánh Giá Token Economy Tiering
Thẩm định và điền vào đầu `plan.md`:
- 🟢 **LOW**: CSS, text, i18n, sửa logic 1 file. Model khuyến nghị: `Flash` / `Flash-Lite`.
- 🟡 **MEDIUM**: CRUD, Modal form, bộ lọc, 2-4 files. Model khuyến nghị: `Flash` (Thinking Medium).
- 🔴 **HIGH**: Auth, RBAC, Migration DB lớn, tái cấu trúc luồng đa repo. Model khuyến nghị: `Pro` (Thinking High).

### Bước 4: Hoàn Thiện File Kế Hoạch (`plan.md` & `technical-spec.md`)
- Cập nhật ma trận file (File Matrix: file tạo mới, file sửa đổi, trách nhiệm).
- Đặc tả API contracts (kebab-case danh từ số nhiều), Request / Response DTOs.
- Nếu có sơ đồ luồng: viết vào `technical-spec.md` dạng Mermaid diagram.

### Bước 5: Báo Cáo Kế Hoạch Cho Người Dùng
- Báo cáo ngắn gọn mã tính năng, phạm vi, token tier khuyến nghị và đường dẫn file `file://...`.
- Nếu có thay đổi UI: xin phép xác nhận từ người dùng.
- **Tuyệt đối chưa sửa đổi mã nguồn** trong bước này.
