import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { User, Mail, Phone, MapPin, Lock, Bell, CreditCard, History } from 'lucide-react';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

export function UserProfile() {
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912345678',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    promotions: true
  });

  const handleUpdateProfile = () => {
    toast.success('Cập nhật thông tin thành công!');
  };

  const handleChangePassword = () => {
    toast.success('Đổi mật khẩu thành công!');
  };

  const recentOrders = [
    { id: 1, service: 'Sửa Điện', date: '2026-01-10', amount: '200,000đ', status: 'completed' },
    { id: 2, service: 'Sửa Nước', date: '2026-01-08', amount: '350,000đ', status: 'completed' },
    { id: 3, service: 'Điều Hòa', date: '2026-01-05', amount: '450,000đ', status: 'completed' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Hồ Sơ Của Tôi</h1>
        <p className="text-gray-600 text-lg">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{userData.name}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Thành viên từ:</span>
                <span className="font-semibold">Tháng 1, 2026</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tổng đơn hàng:</span>
                <Badge variant="secondary">15</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge className="bg-green-500">Đang hoạt động</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Thay Đổi Ảnh Đại Diện
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Thông Tin</TabsTrigger>
              <TabsTrigger value="security">Bảo Mật</TabsTrigger>
              <TabsTrigger value="notifications">Thông Báo</TabsTrigger>
              <TabsTrigger value="history">Lịch Sử</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Cá Nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      <User className="inline h-4 w-4 mr-2" />
                      Họ và tên
                    </Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Địa chỉ
                    </Label>
                    <Input
                      id="address"
                      value={userData.address}
                      onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdateProfile}>Cập Nhật Thông Tin</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Bảo Mật Tài Khoản</CardTitle>
                  <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Mật khẩu hiện tại
                    </Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <p className="font-semibold mb-2">Yêu cầu mật khẩu:</p>
                    <ul className="text-gray-600 space-y-1 list-disc list-inside">
                      <li>Ít nhất 8 ký tự</li>
                      <li>Bao gồm chữ hoa và chữ thường</li>
                      <li>Có ít nhất một số</li>
                      <li>Có ít nhất một ký tự đặc biệt</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleChangePassword}>Đổi Mật Khẩu</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Cài Đặt Thông Báo</CardTitle>
                  <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        <Mail className="inline h-4 w-4 mr-2" />
                        Thông báo qua Email
                      </Label>
                      <p className="text-sm text-gray-500">Nhận thông báo về đơn hàng qua email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        <Phone className="inline h-4 w-4 mr-2" />
                        Thông báo qua SMS
                      </Label>
                      <p className="text-sm text-gray-500">Nhận tin nhắn SMS khi có cập nhật</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        <Bell className="inline h-4 w-4 mr-2" />
                        Thông báo đẩy
                      </Label>
                      <p className="text-sm text-gray-500">Nhận thông báo đẩy trên trình duyệt</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Khuyến mãi và ưu đãi</Label>
                      <p className="text-sm text-gray-500">Nhận thông tin về chương trình khuyến mãi</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, promotions: checked })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success('Cập nhật cài đặt thành công!')}>
                    Lưu Cài Đặt
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch Sử Đơn Hàng</CardTitle>
                  <CardDescription>Các đơn hàng gần đây của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <History className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{order.service}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{order.amount}</p>
                          <Badge variant="outline" className="mt-1">Hoàn thành</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Xem Tất Cả Đơn Hàng</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
