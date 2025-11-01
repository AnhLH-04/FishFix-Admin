import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  ShoppingCart,
  CreditCard,
  Brain,
  MessageSquare,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  {
    icon: Users,
    label: "Người dùng",
    path: "/admin/customers",
  },
  {
    icon: Wrench,
    label: "Thợ sửa chữa",
    path: "/admin/technicians",
  },
  {
    icon: ShoppingCart,
    label: "Đơn hàng",
    path: "/admin/orders",
  },
  {
    icon: CreditCard,
    label: "Thanh toán",
    path: "/admin/payments",
  },
  { icon: Brain, label: "AI Analytics", path: "/admin/ai" },
  {
    icon: MessageSquare,
    label: "Hỗ trợ",
    path: "/admin/support",
  },
  { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
          }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <Link
              to="/admin"
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-[#007BFF] to-purple-600 bg-clip-text text-transparent">
                  FishFix
                </span>
                <div className="text-xs text-gray-500">
                  Admin
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${active
                  ? "bg-gradient-to-r from-[#007BFF] to-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-50"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 ${active ? "text-white" : "text-gray-600 group-hover:text-[#007BFF]"}`}
                />
                {sidebarOpen && (
                  <span className="flex-1">{item.label}</span>
                )}
                {sidebarOpen && active && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#007BFF] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        >
          {sidebarOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-blue-100">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#007BFF]"
                />
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
                <DropdownMenuContent
                  align="end"
                  className="w-80"
                >
                  <DropdownMenuLabel>
                    Thông báo
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-2 p-2">
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <p className="text-sm">
                        Đơn hàng mới #1234
                      </p>
                      <p className="text-xs text-gray-500">
                        5 phút trước
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <p className="text-sm">Thợ mới đăng ký</p>
                      <p className="text-xs text-gray-500">
                        15 phút trước
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <p className="text-sm">Khiếu nại mới</p>
                      <p className="text-xs text-gray-500">
                        1 giờ trước
                      </p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                      AD
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm">Admin</p>
                      <p className="text-xs text-gray-500">
                        admin@FishFix.vn
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    Tài khoản
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem>
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
      </div>
    </div>
  );
}