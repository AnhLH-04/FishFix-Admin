import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  History,
  Wallet,
  CalendarDays,
  LifeBuoy,
  Settings,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  Wrench,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../auth/AuthProvider";

type TechMenuItem = { icon: any; label: string; path: string; end?: boolean; section?: string };

const techMenu: TechMenuItem[] = [
  { section: "CHÍNH", icon: LayoutDashboard, label: "Bảng điều khiển", path: "/tech", end: true },
  { icon: ClipboardList, label: "Đơn hàng mới", path: "/tech/new-orders" },
  { icon: History, label: "Lịch sử sửa chữa", path: "/tech/history" },
  { icon: Wallet, label: "Ví & Thu nhập", path: "/tech/wallet" },
  { icon: CalendarDays, label: "Lịch làm việc", path: "/tech/schedule" },
  { section: "HỖ TRỢ & HỆ THỐNG", icon: LifeBuoy, label: "Hỗ trợ kỹ thuật", path: "/tech/support" },
  { icon: Settings, label: "Cài đặt hệ thống", path: "/tech/settings" },
];

export function TechnicianProLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [online, setOnline] = useState(true);
  const [q, setQ] = useState("");
  const location = useLocation();
  const { me, logout } = useAuth();

  const displayName = me?.fullName || me?.email || me?.phone || "Kỹ thuật viên";
  const subtitle = useMemo(() => {
    // bạn có thể map theo role/skills từ API
    return "Chuyên viên kỹ thuật";
  }, []);

  const initials = useMemo(() => {
    const base = (me?.fullName || me?.email || me?.phone || "T").trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const take = parts.slice(0, 2).map((p: string) => p[0]?.toUpperCase() ?? "");
    return take.join("") || "T";
  }, [me?.fullName, me?.email, me?.phone]);

  const isActive = (path: string) => {
    if (path === "/tech") return location.pathname === "/tech";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r z-40 transition-all duration-300 ${
          sidebarOpen ? "w-[280px]" : "w-[86px]"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link to="/tech" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-indigo-600 flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="leading-tight">
                <div className="font-extrabold text-gray-900">Thợ Pro</div>
                <div className="text-xs text-gray-500">Connect</div>
              </div>
            )}
          </Link>

          {sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-xl">
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="rounded-xl mx-auto">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
          )}
        </div>

        {/* Profile card */}
        <div className="p-4">
          <div className={`rounded-2xl border bg-gray-50 p-3 ${sidebarOpen ? "" : "flex justify-center"}`}>
            <div className={`flex items-center gap-3 ${sidebarOpen ? "" : "justify-center"}`}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="font-extrabold bg-white">{initials}</AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="font-extrabold text-gray-900 truncate">{displayName}</div>
                  <div className="text-xs text-gray-500 truncate">{subtitle}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-3 pb-3 space-y-2">
          {techMenu.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            const showSection = item.section && sidebarOpen;
            return (
              <div key={`${item.path}-${idx}`}>
                {showSection && (
                  <div className="px-2 pt-2 pb-1 text-[11px] font-bold text-gray-400">{item.section}</div>
                )}

                <NavLink
                  to={item.path}
                  end={item.end}
                  className={[
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                    active ? "bg-[#007BFF] text-white shadow-sm" : "text-gray-700 hover:bg-blue-50",
                    sidebarOpen ? "" : "justify-center",
                  ].join(" ")}
                >
                  <Icon className={["w-5 h-5", active ? "text-white" : "text-gray-600"].join(" ")} />
                  {sidebarOpen && <span className="font-semibold">{item.label}</span>}
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* Logout bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => logout()}
            className={[
              "w-full rounded-xl border px-3 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition",
              sidebarOpen ? "" : "justify-center",
            ].join(" ")}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-semibold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-[280px]" : "ml-[86px]"}`}>
        {/* Header (giữ phong cách AdminLayout) */}
        <header className="h-16 bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-[520px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm mã đơn, khách hàng..."
                  className="pl-10 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#007BFF]"
                />
              </div>
            </div>

            {/* Online toggle */}
            <div className="hidden md:flex items-center gap-3 bg-gray-50 border rounded-full px-3 py-2">
              <div className="text-xs font-bold text-gray-500">TRẠNG THÁI</div>
              <div className="flex items-center gap-2">
                <Switch checked={online} onCheckedChange={setOnline} />
                <span className={`text-sm font-extrabold ${online ? "text-green-600" : "text-gray-500"}`}>
                  {online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 hover:bg-blue-50 rounded-xl transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      2
                    </Badge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2 p-2">
                    <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                      <p className="text-sm font-semibold">Có đơn mới gần bạn</p>
                      <p className="text-xs text-gray-500 mt-0.5">2 phút trước</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                      <p className="text-sm font-semibold">Lịch hẹn sắp tới</p>
                      <p className="text-xs text-gray-500 mt-0.5">Hôm nay 15:30</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-xl transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="font-extrabold bg-gradient-to-br from-indigo-500 to-sky-500 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block leading-tight">
                      <p className="text-sm font-extrabold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">ID: {me?.id ?? "—"}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/tech/settings">Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>

        {/* Footer kiểu ảnh */}
        <footer className="px-6 pb-6">
          <div className="border-t pt-4 text-xs text-gray-500 flex items-center justify-between">
            <div>© 2024 Thợ Pro - Hệ thống quản lý kỹ thuật viên</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-700" href="#">
                Điều khoản
              </a>
              <a className="hover:text-gray-700" href="#">
                Bảo mật
              </a>
              <a className="hover:text-gray-700" href="#">
                Liên hệ
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
