# Anti-Shortcut & Verification Rules

## 1. Chống Chữa Cháy Tạm Bợ (Anti-Shortcut)
- **Cấm vá lỗi đối phó**: Không hardcode điều kiện `if/else` tạm bợ, không dùng biến cờ cục bộ để che giấu lỗi hiển thị.
- **Single Source of Truth**: Dữ liệu phải đi thông suốt từ Database qua API đến UI.

## 2. Kiểm Thử Toàn Vẹn Hành Trình Người Dùng (Holistic Verification)
- Không coi việc "code compile thành công" hay linter pass là xong.
- Phải kiểm tra toàn chu trình: Tạo dữ liệu -> Hiển thị danh sách -> Bộ lọc -> Mở modal sửa -> Lưu trữ DB thực tế.

## 3. Cấm Tuyệt Đối Cơ Chế Mock Fallback (Zero-Mock-Fallback Policy)
- Cấm tạo các file mock data (`mock.ts`, `persist.ts`) để thế chỗ API thật.
- Cấm các khối `catch` tự sinh ID giả lập (`LP-XXXXXX`, `pi_mock_...`, `setIsSuccess(true)`) khi có lỗi mạng.
- Khi có lỗi, phải hiển thị thông báo lỗi trung thực để kịp thời phát hiện và xử lý tận gốc.
