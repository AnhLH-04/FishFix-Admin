// src/components/worker/TechnicianLayout.tsx
import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  History,
  Wallet,
  CalendarDays,
  LifeBuoy,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Wrench,
  MapPin,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import logoWhite from "../../assets/logowhite.png";
import { useAuth } from "../../auth/AuthProvider";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type TechMenuItem = {
  icon: any;
  label: string;
  path: string;
  end?: boolean;
  group?: "CHÍNH" | "HỖ TRỢ & HỆ THỐNG";
};

const techMenuItems: TechMenuItem[] = [
  { icon: LayoutDashboard, label: "Bảng điều khiển", path: "/tech", end: true, group: "CHÍNH" },
  { icon: ClipboardList, label: "Đơn hàng mới", path: "/tech/new-orders", group: "CHÍNH" },
  { icon: History, label: "Lịch sử sửa chữa", path: "/tech/history", group: "CHÍNH" },
  { icon: Wallet, label: "Ví & Thu nhập", path: "/tech/wallet", group: "CHÍNH" },
  { icon: CalendarDays, label: "Lịch làm việc", path: "/tech/schedule", group: "CHÍNH" },

  { icon: LifeBuoy, label: "Hỗ trợ kỹ thuật", path: "/tech/support", group: "HỖ TRỢ & HỆ THỐNG" },
  { icon: Settings, label: "Cài đặt hệ thống", path: "/tech/settings", group: "HỖ TRỢ & HỆ THỐNG" },
];

export function TechnicianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [online, setOnline] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { me, logout } = useAuth();

  const displayName = me?.fullName || me?.email || me?.phone || "Kỹ thuật viên";
  const subTitle = "Chuyên gia kỹ thuật";

  const isActive = (path: string) => {
    if (path === "/worker") return location.pathname === "/worker";
    return location.pathname.startsWith(path);
  };

  const grouped = useMemo(() => {
    const g1 = techMenuItems.filter((m) => m.group === "CHÍNH");
    const g2 = techMenuItems.filter((m) => m.group === "HỖ TRỢ & HỆ THỐNG");
    return { g1, g2 };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ===== Sidebar (style AdminLayout) ===== */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <Link to="/tech" className="flex items-center gap-3 group">
              <img src={logoWhite} alt="Fish Fix" className="h-16 w-16 object-contain" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Fish Fix
                </h1>
                <p className="text-xs text-gray-600 font-medium">Sửa Chữa Chuyên Nghiệp</p>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Technician card (giống ảnh: avatar + tên + chuyên môn) */}
        <div className={`px-4 pt-4 ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="rounded-2xl border bg-white shadow-sm p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-extrabold">
              {displayName?.trim()?.[0]?.toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-gray-900 truncate">{displayName}</div>
              <div className="text-xs text-gray-500 truncate">{subTitle}</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-4">
          {/* Group: CHÍNH */}
          <div>
            {sidebarOpen && <div className="px-2 text-xs font-bold text-gray-400 mb-2">CHÍNH</div>}
            <div className="space-y-2">
              {grouped.g1.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={() =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                        active
                          ? "bg-gradient-to-r from-[#007BFF] to-blue-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-blue-50"
                      }`
                    }
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-600 group-hover:text-[#007BFF]"}`} />
                    {sidebarOpen && <span className="flex-1">{item.label}</span>}
                    {sidebarOpen && active && <ChevronRight className="w-4 h-4" />}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Group: HỖ TRỢ & HỆ THỐNG */}
          <div>
            {sidebarOpen && <div className="px-2 text-xs font-bold text-gray-400 mb-2">HỖ TRỢ & HỆ THỐNG</div>}
            <div className="space-y-2">
              {grouped.g2.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={() =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                        active
                          ? "bg-gradient-to-r from-[#007BFF] to-blue-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-blue-50"
                      }`
                    }
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-600 group-hover:text-[#007BFF]"}`} />
                    {sidebarOpen && <span className="flex-1">{item.label}</span>}
                    {sidebarOpen && active && <ChevronRight className="w-4 h-4" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout (giống ảnh: đặt cuối sidebar) */}
        <div className={`absolute left-0 right-0 bottom-0 p-4 ${sidebarOpen ? "block" : "hidden"}`}>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        {/* Toggle Button (y chang AdminLayout) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#007BFF] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {/* ===== Main Content ===== */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}>
        {/* ===== Header (lấy từ AdminLayout nhưng chỉnh nội dung theo ảnh) ===== */}
        <header className="h-16 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-blue-100">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm mã đơn, khách hàng..."
                  className="pl-10 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#007BFF]"
                />
              </div>
            </div>

            {/* Status toggle (TRẠNG THÁI Online) */}
            <div className="hidden md:flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-3 py-2 shadow-sm">
              <div className="text-xs font-extrabold text-gray-500">TRẠNG THÁI</div>
              <div className="flex items-center gap-2">
                <Switch checked={online} onCheckedChange={setOnline} />
                <div className={`text-sm font-bold ${online ? "text-green-600" : "text-gray-500"}`}>
                  {online ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      3
                    </Badge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2 p-2">
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <p className="text-sm font-semibold">Có đơn mới gần bạn</p>
                      <p className="text-xs text-gray-500">5 phút trước</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <p className="text-sm font-semibold">Khách hàng nhắn tin</p>
                      <p className="text-xs text-gray-500">15 phút trước</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <p className="text-sm font-semibold">Đơn #1234 cập nhật</p>
                      <p className="text-xs text-gray-500">1 giờ trước</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Technician Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#007BFF] to-purple-600 rounded-full flex items-center justify-center text-white font-extrabold">
                      {displayName?.trim()?.[0]?.toUpperCase() ?? "T"}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold">{displayName}</p>
                      <p className="text-xs text-gray-500">Kỹ thuật viên</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/worker/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>

        {/* ===== Footer (mượn tinh thần admin - gọn, giống ảnh) ===== */}
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHs0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHs0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="grid md:grid-cols-4 gap-10">
              {/* About */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img src={logoWhite} alt="Fish Fix" className="h-16 w-16 object-contain" />
                  <h3 className="text-xl font-bold">Fish Fix</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Nền tảng kết nối khách hàng với các thợ sửa chữa chuyên nghiệp, uy tín trên toàn quốc.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61586111595077"
                    className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Liên Kết Nhanh</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/services"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Dịch Vụ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/technicians"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Tìm Thợ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Về
                      Chúng Tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/technician"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Tuyển
                      Dụng
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Hỗ Trợ</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Câu Hỏi
                      Thường Gặp
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Điều
                      Khoản Sử Dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Chính
                      Sách Bảo Mật
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Liên Hệ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Liên Hệ</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors duration-200 group">
                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-gray-700 transition-colors">
                      <MapPin className="h-5 w-5 text-blue-500" />
                    </div>
                    <span>Lô E2a-7, Đường D1, Khu Công nghệ cao, Tăng Nhơn Phú, TP HCM</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Phone className="h-5 w-5 text-blue-500" />
                    </div>
                    <a href="tel:0876767076" className="text-gray-400 hover:text-white transition-colors duration-200">
                      0876767076
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <a
                      href="mailto:ad.fishfix@gmail.com"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      ad.fishfix@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-gray-400 text-sm">&copy; 2026 Fish Fix. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default TechnicianLayout;
