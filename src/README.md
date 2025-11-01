# 🔧 FishFix Admin Dashboard

Admin Dashboard cho nền tảng kết nối khách hàng với thợ sửa chữa gia đình - "Grab cho dịch vụ sửa chữa"

## 🚀 Tính năng chính

### 📊 Dashboard Tổng Quan
- Stats cards: Doanh thu, Đơn hàng, Thợ hoạt động, Người dùng mới
- Biểu đồ doanh thu và đơn hàng (7 ngày)
- Biểu đồ phân bố dịch vụ (Điện, Nước, Máy lạnh, Máy giặt...)
- Top 5 thợ xuất sắc theo rating
- Đơn hàng gần đây real-time
- Hoạt động AI hôm nay

### 👥 Quản lý Người dùng
- Danh sách khách hàng với tìm kiếm và lọc
- Xem chi tiết thông tin khách hàng
- Thống kê số đơn và tổng chi tiêu
- Khóa/Mở khóa tài khoản
- Phân loại khách VIP

### 🔨 Quản lý Thợ sửa chữa
- Tabs: Đang hoạt động / Chờ phê duyệt
- Trạng thái: Online / Offline / Đang bận
- Rating, số việc hoàn thành, doanh thu
- Kỹ năng và khu vực phục vụ
- Phê duyệt/Từ chối thợ mới đăng ký
- Xem chi tiết hồ sơ và chứng chỉ

### 📦 Quản lý Đơn hàng
- Theo dõi tất cả đơn hàng
- Trạng thái: Đang tìm thợ / Đang làm / Hoàn thành / Đã hủy
- Chi tiết đơn với AI analysis
- Timeline tiến trình
- Thông tin khách hàng và thợ
- Filter theo trạng thái và dịch vụ

### 💰 Quản lý Thanh toán
- Tổng doanh thu và hoa hồng nền tảng
- Biểu đồ doanh thu theo thời gian
- Phân bổ phương thức thanh toán (Tiền mặt, Chuyển khoản, Ví điện tử, Thẻ)
- Lịch sử giao dịch chi tiết
- Xuất báo cáo

### 🤖 AI Analytics
- Tổng số dự đoán và độ chính xác
- Biểu đồ hoạt động AI (Tư vấn, Phân tích, Gợi ý)
- Phân loại sự cố theo danh mục
- Độ chính xác từng mô hình AI
- Dự đoán gần đây với confidence score
- Gợi ý cải thiện mô hình

### 💬 Hỗ trợ & Khiếu nại
- Quản lý khiếu nại từ khách và thợ
- Phân loại độ ưu tiên (Cao/Trung bình/Thấp)
- Trạng thái xử lý
- Form giải quyết khiếu nại
- Lịch sử xử lý

### ⚙️ Cài đặt Hệ thống
- **Chung**: Thông tin nền tảng, logo, màu sắc
- **Phí & Hoa hồng**: Tỷ lệ hoa hồng, phí đặt cọc, phí hủy
- **AI**: API keys (OpenAI, Google Vision, AWS), cấu hình models
- **Email**: SMTP, template email, thông báo tự động
- **Phân quyền**: Quản lý vai trò (Super Admin, Admin, Staff, Moderator)

## 🎨 Thiết kế

### Màu sắc
- **Primary**: Trắng + Xanh Dương (#007BFF)
- **Gradient**: Blue to Purple
- **Accent colors**: Green (success), Orange (warning), Red (error)

### Components
- Sidebar thu/mở với animations
- Stats cards với gradient backgrounds
- Biểu đồ Recharts (Line, Bar, Pie)
- Tables với search và filter
- Dialogs/Modals cho chi tiết
- Badge indicators
- Progress bars
- Tabs navigation

### Animations
- Slide-up entrance
- Float animations
- Pulse glow effects
- Gradient shifts
- Hover transitions
- Blob animations

## 📱 Routes

```
/                       → Redirect to /login
/login                  → Trang đăng nhập
/admin                  → Dashboard tổng quan
/admin/customers        → Quản lý khách hàng
/admin/technicians      → Quản lý thợ
/admin/orders           → Quản lý đơn hàng
/admin/payments         → Quản lý thanh toán
/admin/ai               → AI Analytics
/admin/support          → Hỗ trợ & Khiếu nại
/admin/settings         → Cài đặt hệ thống
```

## 🔐 Demo Login

```
Email: admin@FishFix.vn
Password: admin123
```

## 🛠️ Tech Stack

- **React** + **TypeScript**
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI Components
- **Recharts** - Charts & Graphs
- **Lucide React** - Icons

## 📦 Components Structure

```
components/
├── admin/
│   ├── AdminLayout.tsx        → Layout với sidebar
│   ├── AdminLogin.tsx         → Trang đăng nhập
│   ├── AdminOverview.tsx      → Dashboard tổng quan
│   ├── AdminCustomers.tsx     → Quản lý khách hàng
│   ├── AdminTechnicians.tsx   → Quản lý thợ
│   ├── AdminOrders.tsx        → Quản lý đơn hàng
│   ├── AdminPayments.tsx      → Quản lý thanh toán
│   ├── AdminAI.tsx            → AI Analytics
│   ├── AdminSupport.tsx       → Hỗ trợ & Khiếu nại
│   ├── AdminSettings.tsx      → Cài đặt
│   └── NotFound.tsx           → 404 Page
└── ui/                        → Shadcn components
```

## 🎯 Responsive Design

- **Desktop First**: Tối ưu cho màn hình lớn
- **Mobile Support**: Responsive trên tablet và mobile
- Sidebar thu gọn trên màn hình nhỏ
- Tables scroll horizontal
- Optimized touch targets

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Access the app:
```
http://localhost:5173
```

4. Login với demo credentials

## 📈 Features Roadmap

- [ ] Real-time notifications
- [ ] Export data to CSV/PDF
- [ ] Advanced filtering
- [ ] Bulk actions
- [ ] Email templates editor
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Activity logs
- [ ] API documentation

## 🎨 Design System

### Typography
- Headings: Medium weight (500)
- Body: Normal weight (400)
- Font size: 16px base

### Spacing
- Cards: p-6 (24px)
- Sections: gap-6 (24px)
- Elements: gap-4 (16px)

### Shadows
- Cards: shadow-lg
- Hover: shadow-xl
- Float: shadow-2xl

### Borders
- Radius: rounded-lg (0.625rem)
- XL radius: rounded-xl (1rem)

## 👨‍💻 Development Notes

- Mock data được sử dụng cho demo
- API calls sẽ được implement sau
- Authentication chưa có backend
- Tất cả actions đều frontend-only

## 📄 License

© 2025 FishFix. All rights reserved.

---

**Made with ❤️ for FishFix Platform**
