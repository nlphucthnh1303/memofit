---
name: clear
description: Xả sạch bộ nhớ ngữ cảnh trò chuyện, đưa agent về trạng thái sạch sẽ ban đầu (Clean Slate), loại bỏ mọi giả định tạm thời.
---

# Skill `/clear` (Alias: `/reset`) — Làm Mới Bộ Nhớ Ngữ Cảnh

## 1. Mục Đích
Làm sạch ngữ cảnh trao đổi, đưa Agent về trạng thái ban đầu (Clean Slate), loại bỏ toàn bộ các giả định tạm thời của phiên cũ để bắt đầu tác vụ mới với 100% dung lượng context sạch.

---

## 2. Cú Pháp
```bash
/clear
# hoặc
/reset
```

---

## 3. Quy Trình Thực Hiện
1. Nhắc nhở người dùng nếu có công việc quan trọng chưa lưu thì nên dùng `/zip` trước.
2. Xóa các biến trạng thái tạm thời trong phiên.
3. Báo cáo xác nhận ngữ cảnh đã được làm mới thành công và sẵn sàng đón nhận yêu cầu tiếp theo.
