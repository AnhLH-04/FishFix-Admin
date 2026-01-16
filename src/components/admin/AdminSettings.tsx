import { Settings, DollarSign, Key, Mail, Palette, Shield, Users, Badge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

export function AdminSettings() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-600">Quản lý cấu hình và tham số nền tảng</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="commission">
            <DollarSign className="w-4 h-4 mr-2" />
            Phí & Hoa hồng
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Key className="w-4 h-4 mr-2" />
            Cấu hình AI
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email & Thông báo
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="w-4 h-4 mr-2" />
            Phân quyền
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Thông tin nền tảng</CardTitle>
              <CardDescription>Cấu hình thông tin cơ bản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên nền tảng</Label>
                  <Input defaultValue="FishFix" />
                </div>
                <div className="space-y-2">
                  <Label>Hotline</Label>
                  <Input defaultValue="1900-xxxx" />
                </div>
                <div className="space-y-2">
                  <Label>Email hỗ trợ</Label>
                  <Input type="email" defaultValue="support@FishFix.vn" />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input defaultValue="https://FishFix.vn" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Địa chỉ văn phòng</Label>
                <Input defaultValue="TP. Hồ Chí Minh, Việt Nam" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Chế độ bảo trì</p>
                  <p className="text-sm text-gray-500">Tạm khóa hệ thống cho người dùng</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Cho phép đăng ký thợ mới</p>
                  <p className="text-sm text-gray-500">Mở/đóng chức năng đăng ký</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-gradient-to-r from-[#007BFF] to-blue-600">
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Giao diện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Màu chủ đạo</Label>
                <div className="flex gap-2">
                  <Input type="color" defaultValue="#007BFF" className="w-20 h-10" />
                  <Input defaultValue="#007BFF" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <Input type="file" accept="image/*" />
              </div>
              <Button className="bg-gradient-to-r from-[#007BFF] to-blue-600">
                Cập nhật giao diện
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Settings */}
        <TabsContent value="commission" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Phí nền tảng</CardTitle>
              <CardDescription>Cấu hình tỷ lệ hoa hồng và phí dịch vụ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Hoa hồng nền tảng (%)</Label>
                  <Input type="number" defaultValue="15" />
                  <p className="text-xs text-gray-500">Phần trăm trên mỗi đơn hàng</p>
                </div>
                <div className="space-y-2">
                  <Label>Phí đặt cọc (%)</Label>
                  <Input type="number" defaultValue="20" />
                  <p className="text-xs text-gray-500">Khách đặt cọc trước khi thợ nhận</p>
                </div>
                <div className="space-y-2">
                  <Label>Phí hủy đơn cho khách (₫)</Label>
                  <Input type="number" defaultValue="50000" />
                  <p className="text-xs text-gray-500">Nếu hủy sau khi thợ đã nhận</p>
                </div>
                <div className="space-y-2">
                  <Label>Phí hủy đơn cho thợ (₫)</Label>
                  <Input type="number" defaultValue="100000" />
                  <p className="text-xs text-gray-500">Phạt nếu thợ hủy sau khi nhận</p>
                </div>
              </div>
              <Separator />
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Ví dụ tính toán:</h4>
                <div className="space-y-1 text-sm">
                  <p>Giá dịch vụ: ₫500,000</p>
                  <p>Hoa hồng (15%): ₫75,000</p>
                  <p className="text-green-600 font-medium">Thợ nhận: ₫425,000</p>
                  <p className="text-blue-600 font-medium">Nền tảng: ₫75,000</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-[#007BFF] to-blue-600">
                Lưu cấu hình
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Phí dịch vụ theo danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Điện', 'Nước', 'Máy lạnh', 'Máy giặt', 'Điện tử'].map((category) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="15" className="w-20" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                Áp dụng thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Cấu hình các API keys cho AI và dịch vụ bên thứ 3</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input type="password" defaultValue="sk-xxxxxxxxxxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label>Google Vision API Key</Label>
                <Input type="password" defaultValue="AIzaxxxxxxxxxxxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label>AWS Rekognition Access Key</Label>
                <Input type="password" defaultValue="AKIAxxxxxxxxxx" />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Lưu API Keys
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Cấu hình AI Models</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Bật phân tích hình ảnh AI</p>
                  <p className="text-sm text-gray-500">Tự động phân tích ảnh từ khách hàng</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Tự động gợi ý thợ</p>
                  <p className="text-sm text-gray-500">AI tự động matching thợ phù hợp</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Chatbot tư vấn</p>
                  <p className="text-sm text-gray-500">AI trả lời câu hỏi khách hàng</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Enable GPT-5 for all clients</p>
                  <p className="text-sm text-gray-500">Upgrade all clients to use GPT-5 model</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Độ tin cậy tối thiểu (%)</Label>
                <Input type="number" defaultValue="80" />
                <p className="text-xs text-gray-500">
                  AI chỉ đưa ra kết quả khi độ tin cậy {'>'} ngưỡng này
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Cập nhật cấu hình
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Cấu hình Email</CardTitle>
              <CardDescription>SMTP và template email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Host</Label>
                  <Input defaultValue="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input type="number" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label>Email gửi</Label>
                  <Input type="email" defaultValue="noreply@FishFix.vn" />
                </div>
                <div className="space-y-2">
                  <Label>Mật khẩu</Label>
                  <Input type="password" defaultValue="••••••••" />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-[#007BFF] to-blue-600">
                Lưu cấu hình SMTP
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Thông báo tự động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email xác nhận đơn hàng</p>
                  <p className="text-sm text-gray-500">Gửi cho khách khi đặt đơn thành công</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email thợ được giao việc</p>
                  <p className="text-sm text-gray-500">Thông báo khi có đơn mới</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email hoàn thành dịch vụ</p>
                  <p className="text-sm text-gray-500">Yêu cầu đánh giá sau khi hoàn thành</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Thông báo thanh toán</p>
                  <p className="text-sm text-gray-500">Email xác nhận giao dịch</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Quản lý vai trò
              </CardTitle>
              <CardDescription>Phân quyền và quản lý người dùng hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Super Admin', 'Admin', 'Staff', 'Moderator'].map((role) => (
                <div key={role} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{role}</h4>
                    <Button variant="outline" size="sm">
                      Chỉnh sửa
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={role === 'Super Admin'} />
                      <span className="text-gray-600">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={role === 'Super Admin' || role === 'Admin'} />
                      <span className="text-gray-600">Người dùng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={role === 'Super Admin' || role === 'Admin'} />
                      <span className="text-gray-600">Thợ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-gray-600">Đơn hàng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={role !== 'Moderator'} />
                      <span className="text-gray-600">Thanh toán</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={role === 'Super Admin'} />
                      <span className="text-gray-600">Cài đặt</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Danh sách quản trị viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Admin A', email: 'admin@FishFix.vn', role: 'Super Admin' },
                  { name: 'Staff B', email: 'staff@FishFix.vn', role: 'Staff' },
                  { name: 'Moderator C', email: 'mod@FishFix.vn', role: 'Moderator' },
                ].map((admin, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{admin.role}</Badge>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  + Thêm quản trị viên
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
