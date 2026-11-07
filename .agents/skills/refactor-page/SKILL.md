---
name: refactor-page
description: Tái cấu trúc file monolithic page cồng kềnh thành thư mục module hóa sạch sẽ (Orchestrator + sub-components) với cam kết Zero Regression.
---

# Skill `/refactor-page` — Tái Cấu Trúc Monolithic Page Thành Module Hóa

## 1. Mục Đích
Phân rã một trang giao diện khổng lồ (monolithic page hàng trăm dòng) thành thư mục module hóa sạch sẽ, dễ bảo trì, dễ kiểm thử, giữ nguyên 100% giao diện và nghiệp vụ (Zero Regression).

---

## 2. Cú Pháp
```bash
/refactor-page <path-to-page-file>
```

---

## 3. Cấu Trúc Đích Chuẩn Hóa
```text
src/.../<PageName>/
├── <PageName>Component.ts/.tsx   # Component chính điều phối (Orchestrator)
├── index.ts                      # Re-export để giữ 100% tương thích router/callers
└── components/                   # Thư mục sub-components độc lập
    ├── <PageName>FilterBar.ts/.tsx
    ├── <PageName>DataTable.ts/.tsx
    ├── <PageName>CreateModal.ts/.tsx
    └── index.ts
```

---

## 4. Nguyên Tắc & Tiêu Chí Bắt Buộc
1. **Zero Regression**: Giữ nguyên 100% visual layout, CSS styling, responsive, animations và user flows. Không thay đổi UI.
2. **Strict Props Interface**: Mọi sub-component đều phải khai báo kiểu Props rõ ràng, không dùng `any`.
3. **Single Responsibility**: Component cha chỉ làm nhiệm vụ kết nối state/services và điều phối (Orchestrator); các component con chỉ đảm nhận một vùng UI cụ thể.
4. **Zero-Comment Policy**: Tuyệt đối không sinh comment trong code tái cấu trúc.
5. **Verify Build**: Chạy build/typecheck ngay sau khi hoàn thành để xác nhận không có import nào bị hỏng.
