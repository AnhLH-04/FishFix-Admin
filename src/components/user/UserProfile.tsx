import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, History, LogOut, ShieldCheck, KeyRound } from "lucide-react";

import { useAuth } from "../../auth/AuthProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

export function UserProfile() {
  const nav = useNavigate();
  const { token, me, loading, logout, isAdmin } = useAuth();

  // ✅ redirect phải làm trong useEffect, không làm trong render
  useEffect(() => {
    if (!loading && !token) nav("/login", { replace: true });
  }, [loading, token, nav]);

  const initials = useMemo(() => {
    const base = (me?.fullName || me?.email || me?.phone || "U").trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const take = parts.slice(0, 2).map((p) => (p[0] ? p[0].toUpperCase() : ""));
    return take.join("") || "U";
  }, [me?.fullName, me?.email, me?.phone]);

  const displayName = me?.fullName || "Chưa đặt tên";
  const displayEmail = me?.email || "Chưa liên kết email";
  const displayPhone = me?.phone || "Chưa liên kết số điện thoại";

  const [form, setForm] = useState({
    fullName: me?.fullName ?? "",
    email: me?.email ?? "",
    phone: me?.phone ?? "",
    address: "",
  });

  // khi me load xong -> sync form
  useEffect(() => {
    setForm({
      fullName: me?.fullName ?? "",
      email: me?.email ?? "",
      phone: me?.phone ?? "",
      address: "",
    });
  }, [me?.fullName, me?.email, me?.phone]);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    nav("/", { replace: true });
  };

  const recentOrders = [
    { id: 1, service: "Sửa Điện", date: "2026-01-10", amount: "200,000đ" },
    { id: 2, service: "Sửa Nước", date: "2026-01-08", amount: "350,000đ" },
    { id: 3, service: "Điều Hòa", date: "2026-01-05", amount: "450,000đ" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50/60 via-white to-gray-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Hồ sơ của tôi</h1>
            <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => nav(isAdmin ? "/admin" : "/orders")}>
              <History className="mr-2 h-4 w-4" />
              Đơn hàng
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <CardTitle className="mt-4">{displayName}</CardTitle>
                <CardDescription className="break-all">{displayEmail}</CardDescription>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <Badge className="bg-green-600 hover:bg-green-600">Đang hoạt động</Badge>
                  <Badge variant="secondary">{isAdmin ? "Admin" : "User"}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">SĐT:</span>
                  <span className="font-semibold">{displayPhone}</span>
                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Bảo mật</p>
                      <p className="text-gray-600 mt-1">
                        Hãy xác minh email/điện thoại và dùng mật khẩu mạnh để an toàn hơn.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => nav("/link-phone")}>
                  Liên kết / xác minh số điện thoại
                </Button>

                <Button variant="outline" className="w-full" onClick={() => nav("/forgot-password")}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Đổi mật khẩu
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Thông tin</TabsTrigger>
                <TabsTrigger value="security">Bảo mật</TabsTrigger>
                <TabsTrigger value="history">Lịch sử</TabsTrigger>
              </TabsList>

              {/* Profile */}
              <TabsContent value="profile">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin hiển thị của bạn</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">
                        <User className="inline h-4 w-4 mr-2" />
                        Họ và tên
                      </Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email
                      </Label>
                      <Input id="email" type="email" value={form.email} disabled />
                      <p className="text-xs text-gray-500 mt-1">
                        Email thường không cho sửa trực tiếp. Nếu cần đổi email, dùng chức năng hỗ trợ.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Số điện thoại
                      </Label>
                      <Input id="phone" type="tel" value={form.phone} disabled />
                      <p className="text-xs text-gray-500 mt-1">
                        Để đổi/ liên kết số điện thoại, dùng chức năng “Liên kết số điện thoại”.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="address">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Địa chỉ
                      </Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Nhập địa chỉ (tuỳ chọn)"
                      />
                    </div>

                    <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
                      Hiện backend của bạn chưa có endpoint cập nhật profile → trang này đang hiển thị UI. Khi có API,
                      mình sẽ nối lại nút “Lưu”.
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button disabled className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Lưu thay đổi
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setForm({
                          fullName: me?.fullName ?? "",
                          email: me?.email ?? "",
                          phone: me?.phone ?? "",
                          address: "",
                        });
                        toast("Đã hoàn tác thay đổi");
                      }}
                    >
                      Hoàn tác
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Bảo mật tài khoản</CardTitle>
                    <CardDescription>Đổi mật khẩu qua luồng “Quên mật khẩu” (đã nối API)</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900 mb-1">Bạn muốn đổi mật khẩu?</p>
                      <p className="text-gray-600">
                        Hiện hệ thống của bạn đã có API <b>Forgot Password</b> + <b>Reset Password</b>. Nhấn nút bên
                        dưới để nhận link đổi mật khẩu qua email.
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => nav("/forgot-password")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      Đi tới đổi mật khẩu
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* History */}
              <TabsContent value="history">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Lịch sử đơn hàng</CardTitle>
                    <CardDescription>Demo hiển thị (chưa nối API orders)</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-xl bg-white hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                              <History className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{order.service}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-blue-700">{order.amount}</p>
                            <Badge variant="outline" className="mt-1">
                              Hoàn thành
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => nav("/orders")}>
                      Xem tất cả đơn hàng
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
