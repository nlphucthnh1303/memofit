# Autonomous Execution & Zero Prompts Rules

## 1. Nguyên Tắc Tự Chủ Tuyệt Đối (Autonomous Execution)
- Khi người dùng đã duyệt plan hoặc gõ lệnh thực thi (`/execute`, `/feature`, `/fix-bug`), agent **tuyệt đối không dừng lại để hỏi ý kiến, không xin xác nhận bước trung gian, không hỏi lựa chọn công nghệ/triển khai**.
- Tự chủ ra quyết định kỹ thuật dựa trên kiến trúc đã định hình, các patterns có sẵn trong codebase và chuẩn mực kỹ thuật.

## 2. Chu Trình Thực Thi Khép Kín (Closed-Loop Cycle)
Agent tự động thực hiện liên tục xuyên suốt chu trình:
```text
Tạo Database Schema/Migration -> Viết Backend Logic/API -> Tạo DTO/Repository Frontend -> Dựng UI Component -> Chạy Build/Test Verify -> Cập nhật Changelog Docs
```
- Agent chỉ dừng lại khi hoàn thành 100% mục tiêu, hoặc khi gặp sự cố môi trường không thể tự giải quyết.
