# Planning & Critical Thinking Rules

## 1. Tư Duy Phản Biện Khi Lập Kế Hoạch (Critical Planning)
- **Không chấp nhận yêu cầu thụ động**: Khi nhận yêu cầu lập kế hoạch (`/plan-feature`), agent không gật đầu làm theo máy móc. Phải chất vấn xem tính năng có cần thiết thực tế hay là "slop" (thừa thãi, làm rối UX/kiến trúc).

## 2. Phân Rã Đệ Quy 5 Tầng (5-Layer Problem Decomposition)
- **Tầng 0 (Bản chất nghiệp vụ)**: Xác định rõ mục tiêu cốt lõi và bài toán thực tế cần giải quyết.
- **Tầng 1 (Quét toàn diện phạm vi)**: Kiểm kê toàn bộ thành phần liên quan (DB Schema, Repositories, Services, APIs, Frontend State, Pages, Types).
- **Tầng 2 (Cây phụ thuộc & Tác động lan truyền)**: Đánh giá chi tiết mọi điểm đứt gãy nếu sửa đổi/xóa bỏ bất kỳ thành phần nào.
- **Tầng 3 (Nguyên nhân gốc rễ & Giả định ngầm)**: Dùng 5 Whys, đào sâu đến tận cùng, xóa bỏ mọi hộp đen.
- **Tầng 4 (Rủi ro & Đánh đổi kiến trúc)**: Phân định rạch ròi Must-have vs Nice-to-have/Slop, đề xuất phương án tối ưu.
- **Tầng 5 (Phân kỳ thực thi & Kiểm chứng E2E)**: Lập các bước triển khai chi tiết, kiểm thử liên tục từng bước.

## 3. Phân Tầng Độ Phức Tạp & Tiết Kiệm Token (Token Economy & Execution Tiering)
Khi lập kế hoạch (`/plan-feature`), agent luôn bắt buộc thẩm định và khuyến nghị cấu hình model:

| Cấp độ | Đặc điểm công việc | Model khuyến nghị | Thinking Effort | Mức tiết kiệm Token |
|:---|:---|:---|:---|:---|
| 🟢 **LOW** | Sửa text, copy, i18n, CSS, màu sắc, vị trí nút, sửa logic 1 file | `Gemini Flash` / `Flash-Lite` | Low hoặc Tắt | Tiết kiệm ~80% token |
| 🟡 **MEDIUM** | Thêm/sửa CRUD cơ bản, Modal form, kết nối API có sẵn, bộ lọc, 2-4 files | `Gemini Flash` | Tiêu chuẩn (Medium) | Tiết kiệm ~45% token |
| 🔴 **HIGH** | Auth, RBAC, Thanh toán, Migration DB lớn, tái cấu trúc luồng đa repo, lỗi ẩn race condition | `Gemini Pro` (hoặc `/boost`) | Tối đa (High) | Toàn diện, an toàn 100% |
