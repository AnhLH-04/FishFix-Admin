import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Home,
  Users,
  Calendar,
  Menu,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import logoWhite from "../../assets/logowhite.png";
import { useAuth } from "../../auth/AuthProvider";

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, me, loading, logout, isAdmin } = useAuth();

  const navItems = [
    { path: "/", label: "Trang Chủ", icon: Home },
    { path: "/about", label: "Về Chúng Tôi", icon: Users },
    { path: "/customer", label: "Khách Hàng", icon: Users },
    { path: "/technician", label: "Thợ", icon: Users },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "hover:bg-gray-100 text-gray-700 hover:text-blue-600"
            } ${mobile ? "w-full" : ""}`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const displayName = me?.fullName || me?.email || me?.phone || "Tài khoản";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logoWhite} alt="Fish Fix" className="h-16 w-16 object-contain" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Fish Fix
                </h1>
                <p className="text-xs text-gray-600 font-medium">Sửa Chữa Chuyên Nghiệp</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <NavLinks />
            </nav>

            {/* Right actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Auth-aware buttons */}
              {!loading && !token && (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-all duration-200">
                    Đăng Nhập
                  </Button>
                </Link>
              )}

              {!loading && token && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(isAdmin ? "/admin" : "/profile")}
                    className="px-3 py-2 rounded-xl hover:bg-gray-100 transition text-sm font-semibold text-gray-800"
                    title={displayName}
                  >
                    {displayName}
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng Xuất
                  </Button>
                </div>
              )}

              <Link to="/booking">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Đặt Lịch Ngay
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />

                  {/* Mobile auth actions */}
                  <div className="mt-4 border-t pt-4 space-y-3">
                    {!loading && !token && (
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                          Đăng Nhập
                        </Button>
                      </Link>
                    )}

                    {!loading && token && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate(isAdmin ? "/admin" : "/profile")}
                        >
                          {displayName}
                        </Button>

                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Đăng Xuất
                        </Button>
                      </>
                    )}

                    <Link to="/booking" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Calendar className="mr-2 h-4 w-4" />
                        Đặt Lịch Ngay
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
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
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-200"></span>Về Chúng
                    Tôi
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
  );
}
