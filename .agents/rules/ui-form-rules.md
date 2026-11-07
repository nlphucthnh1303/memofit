# UI Form Rules & Guardrails

## 1. Kiểm Soát Giao Diện Nghiêm Ngặt (Strict UI Guardrails)
- **Cấm tùy tiện sửa UI**: Không tự ý thêm bớt component, layout, màu sắc, animation, modal ngoài yêu cầu trực tiếp.
- Mọi thay đổi UI phải được người dùng yêu cầu hoặc xin phép trước.

## 2. No Unsolicited helperText
- **Tuyệt đối không tự ý thêm dòng ghi chú `helperText`** dưới các ô input, select, datepicker nếu người dùng không yêu cầu.
- Giữ form sạch sẽ, tối giản.

## 3. Clean Form Labels
- Không đưa chú thích dạng `(Nội dung)` vào label của trường form.
- Không gắn icon trang trí trực tiếp lên label.
