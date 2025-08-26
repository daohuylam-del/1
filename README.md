# Ad Account Finance Manager

**Next.js (App Router) + TypeScript + Prisma (PostgreSQL) + TailwindCSS + shadcn/ui + JWT (HttpOnly) + PWA.**  
Ứng dụng quản lý tài chính cho tài khoản quảng cáo:  
- Mapping **AdAccount ↔ Client** theo **giai đoạn** (lịch sử dùng chung tài khoản/đổi chủ giữa tháng).  
- Theo dõi **nguồn nạp** (Card/Bank), **chi tiêu**, **hóa đơn**, **đối soát** (reconcile) & **đổi tiền** (FX).  
- **PWA installable**, có thể dùng offline cho báo cáo đọc-chỉ.

---

## 1) Tính năng chính
- **Quản lý giai đoạn** AdAccount dùng cho Client (không chồng lấn ngày, có lịch sử).
- **Nguồn nạp đa dạng**: thẻ (Card) hoặc tài khoản ngân hàng (BankAccount); theo dõi statement/transaction.
- **Chi tiêu / Hóa đơn**: nhập tay hoặc import CSV; tự quy đổi tỷ giá (FXRate) nếu chạy USD.
- **Đối soát (Reconciliation)**: khớp chi tiêu với dòng tiền nạp/transaction ngân hàng.
- **Phân quyền** (User/Admin) với JWT HttpOnly cookie.
- **PWA**: có nút **Install** trên header; cache assets & báo cáo đọc-chỉ.

---

## 2) Công nghệ
- **UI:** Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, shadcn/ui  
- **Data:** Prisma ORM, **PostgreSQL**  
- **Auth:** JWT HttpOnly (API routes)  
- **Khác:** PWA, FX conversion, Zod validation

---

## 3) Yêu cầu hệ thống
- **Node.js ≥ 18.18**
- **PostgreSQL** đang chạy & truy cập được qua `DATABASE_URL`

---

## 4) Bắt đầu nhanh
```bash
git clone <repo-url>
cd <project-folder>

# 1) Tạo file môi trường
cp .env.example .env.local   # (hoặc .env) và sửa giá trị

# 2) Cài & chuẩn bị DB
npm i
npx prisma generate
npm run prisma:migrate

# 3) Seed dữ liệu mẫu (users, fxrates, clients, ad-accounts…)
npm run seed

# 4) Chạy dev
npm run dev   # http://localhost:3000
