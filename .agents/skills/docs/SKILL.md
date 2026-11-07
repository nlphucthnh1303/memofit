---
name: docs
description: Cổng đồng bộ và kiểm tra toàn diện cây tài liệu docs/, đảm bảo tính nhất quán của features-db.json và không có tài liệu mồ côi.
---

# Skill `/docs` — Quản Lý & Đồng Bộ Cây Tài Liệu Dự Án

## 1. Mục Đích
Quét kiểm tra, đồng bộ và xác minh tính toàn vẹn của toàn bộ cây tài liệu `docs/`, liên kết với cơ sở dữ liệu `docs/features/features-db.json` và phát hiện các file tài liệu mồ côi ngoài cấu trúc quy chuẩn.

---

## 2. Quy Trình Thực Thi
1. **Kiểm tra Cây Thư Mục Quy Chuẩn**:
   - `docs/architecture/system-flows/`
   - `docs/features/features-db.json`
   - `docs/features/[module]/[code]-[slug]/`
   - `docs/rules/active-rules.md`
   - `docs/summaries/`
2. **Đối Chiếu Cơ Sở Dữ Liệu**:
   - Đảm bảo mọi bản ghi trong `docs/features/features-db.json` đều có thư mục và các file `plan.md`, `technical-spec.md`, `changelog.md` tồn tại thực tế.
3. **Phát Hiện File Mồ Côi**:
   - Tìm kiếm các file markdown nằm rải rác ngoài cây thư mục `docs/` và đề xuất dọn dẹp hoặc di chuyển về đúng vị trí.
4. **Báo Cáo Sức Khỏe Tài Liệu**:
   - Tổng số tính năng đã lập kế hoạch / hoàn thành.
   - Trạng thái đồng bộ giữa DB và files thực tế.
