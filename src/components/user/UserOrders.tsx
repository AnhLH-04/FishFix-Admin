import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Clock, MapPin, User, Phone, Star, MessageSquare, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export function UserOrders() {
  const [activeTab, setActiveTab] = useState('pending');

  const orders = [
    {
      id: 1,
      service: 'Sửa Điện',
      technician: 'Nguyễn Văn An',
      technicianPhone: '0912345678',
      date: '2026-01-15',
      timeSlot: '09:00 - 10:00',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      status: 'pending',
      description: 'Sửa ổ cắm điện và thay đèn',
      estimatedPrice: '200,000đ',
      createdAt: '2026-01-12'
    },
    {
      id: 2,
      service: 'Sửa Nước',
      technician: 'Trần Văn Bình',
      technicianPhone: '0923456789',
      date: '2026-01-13',
      timeSlot: '14:00 - 15:00',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      status: 'confirmed',
      description: 'Thông cống và sửa vòi nước',
      estimatedPrice: '350,000đ',
      actualPrice: '380,000đ',
      createdAt: '2026-01-10'
    },
    {
      id: 3,
      service: 'Điều Hòa',
      technician: 'Lê Minh Công',
      technicianPhone: '0934567890',
      date: '2026-01-10',
      timeSlot: '10:00 - 11:00',
      address: '789 Đường DEF, Quận Bình Thạnh, TP.HCM',
      status: 'completed',
      description: 'Vệ sinh và bảo dưỡng điều hòa',
      actualPrice: '450,000đ',
      rating: 5,
      review: 'Thợ làm việc rất chuyên nghiệp và tận tâm',
      createdAt: '2026-01-08',
      completedAt: '2026-01-10'
    },
    {
      id: 4,
      service: 'Sơn Nhà',
      technician: 'Phạm Văn Dũng',
      technicianPhone: '0945678901',
      date: '2026-01-09',
      timeSlot: '08:00 - 09:00',
      address: '321 Đường GHI, Quận 7, TP.HCM',
      status: 'cancelled',
      description: 'Sơn lại phòng khách',
      cancelReason: 'Khách hàng có việc đột xuất',
      createdAt: '2026-01-07',
      cancelledAt: '2026-01-09'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      pending: { label: 'Chờ xác nhận', variant: 'secondary' },
      confirmed: { label: 'Đã xác nhận', variant: 'default' },
      completed: { label: 'Hoàn thành', variant: 'outline' },
      cancelled: { label: 'Đã hủy', variant: 'destructive' }
    };
    const { label, variant } = statusMap[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Đơn Hàng Của Tôi</h1>
        <p className="text-gray-600 text-lg">Quản lý và theo dõi các đơn hàng của bạn</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredOrders.length === 0 ? (
            <Alert>
              <AlertDescription>
                Không có đơn hàng nào trong danh mục này
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {order.service}
                          {getStatusBadge(order.status)}
                        </CardTitle>
                        <CardDescription>Đơn hàng #{order.id} - Đặt ngày {order.createdAt}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {order.actualPrice || order.estimatedPrice}
                        </div>
                        {!order.actualPrice && order.estimatedPrice && (
                          <div className="text-xs text-gray-500">Giá ước tính</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">Thợ:</span>
                          <span>{order.technician}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">SĐT:</span>
                          <span>{order.technicianPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">Lịch hẹn:</span>
                          <span>{order.date} | {order.timeSlot}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-semibold">Địa chỉ:</span>
                            <p className="text-gray-600">{order.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">{order.description}</p>
                    </div>

                    {order.status === 'completed' && order.rating && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Đánh giá của bạn:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < order.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 italic">"{order.review}"</p>
                      </div>
                    )}

                    {order.status === 'cancelled' && order.cancelReason && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          Lý do hủy: {order.cancelReason}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2 pt-2">
                      {order.status === 'pending' && (
                        <>
                          <Button variant="outline" className="flex-1">
                            Chỉnh Sửa
                          </Button>
                          <Button variant="destructive" className="flex-1">
                            Hủy Đơn
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <>
                          <Button variant="outline" className="flex-1">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Nhắn Tin
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Phone className="mr-2 h-4 w-4" />
                            Gọi Thợ
                          </Button>
                        </>
                      )}
                      {order.status === 'completed' && !order.rating && (
                        <Button className="flex-1">
                          <Star className="mr-2 h-4 w-4" />
                          Đánh Giá
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
