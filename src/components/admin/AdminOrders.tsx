import { useState } from 'react';
import { Search, Eye, MapPin, Clock, DollarSign, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const orders = [
  {
    id: '#1245',
    customerId: 1,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    technicianId: 2,
    technicianName: 'Trần Minh B',
    service: 'Sửa điện',
    category: 'Điện',
    address: 'Quận 1, TP.HCM',
    amount: 350000,
    status: 'in_progress',
    aiAnalysis: 'Ngắn mạch do dây điện cũ',
    images: ['image1.jpg', 'image2.jpg'],
    createdAt: '29/10/2025 10:30',
    startedAt: '29/10/2025 11:00',
    estimatedCompletion: '29/10/2025 13:00',
  },
  {
    id: '#1244',
    customerId: 2,
    customerName: 'Trần Thị B',
    customerPhone: '0923456789',
    technicianId: 1,
    technicianName: 'Nguyễn Văn A',
    service: 'Bảo trì máy lạnh',
    category: 'Máy lạnh',
    address: 'Quận 2, TP.HCM',
    amount: 500000,
    status: 'completed',
    aiAnalysis: 'Cần vệ sinh gas và bổ sung gas',
    images: [],
    createdAt: '29/10/2025 09:15',
    startedAt: '29/10/2025 09:45',
    completedAt: '29/10/2025 11:30',
  },
  {
    id: '#1243',
    customerId: 3,
    customerName: 'Lê Minh C',
    customerPhone: '0934567890',
    technicianId: null,
    technicianName: null,
    service: 'Sửa nước rò rỉ',
    category: 'Nước',
    address: 'Quận 3, TP.HCM',
    amount: 280000,
    status: 'finding',
    aiAnalysis: 'Van nước bị hỏng, cần thay mới',
    images: ['image3.jpg'],
    createdAt: '29/10/2025 11:20',
    startedAt: null,
    estimatedCompletion: null,
  },
  {
    id: '#1242',
    customerId: 4,
    customerName: 'Phạm Hoàng D',
    customerPhone: '0945678901',
    technicianId: 3,
    technicianName: 'Lê Hoàng C',
    service: 'Sửa máy giặt',
    category: 'Máy giặt',
    address: 'Quận 7, TP.HCM',
    amount: 420000,
    status: 'completed',
    aiAnalysis: 'Motor máy giặt yếu, cần kiểm tra và thay',
    images: [],
    createdAt: '29/10/2025 08:00',
    startedAt: '29/10/2025 08:30',
    completedAt: '29/10/2025 10:15',
  },
  {
    id: '#1241',
    customerId: 5,
    customerName: 'Vũ Thu E',
    customerPhone: '0956789012',
    technicianId: null,
    technicianName: null,
    service: 'Lắp đèn LED',
    category: 'Điện',
    address: 'Quận 10, TP.HCM',
    amount: 200000,
    status: 'cancelled',
    aiAnalysis: null,
    images: [],
    createdAt: '28/10/2025 16:00',
    cancelledAt: '28/10/2025 16:30',
    cancelReason: 'Khách hàng hủy',
  },
];

export function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finding':
        return (
          <Badge className="bg-orange-500 flex items-center gap-1">
            <Loader className="w-3 h-3 animate-spin" />
            Đang tìm thợ
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Đang làm
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Hoàn thành
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    finding: orders.filter(o => o.status === 'finding').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-600">Theo dõi và quản lý tất cả yêu cầu sửa chữa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Tổng đơn</p>
            <p className="text-3xl text-blue-600">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Đang tìm thợ</p>
            <p className="text-3xl text-orange-600">{stats.finding}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Đang làm</p>
            <p className="text-3xl text-blue-600">{stats.in_progress}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Hoàn thành</p>
            <p className="text-3xl text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Đã hủy</p>
            <p className="text-3xl text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo mã đơn, khách hàng, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="finding">Đang tìm thợ</SelectItem>
                <SelectItem value="in_progress">Đang làm</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Thợ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-blue-50 transition-colors">
                  <TableCell className="font-medium text-[#007BFF]">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.service}</p>
                      <Badge variant="outline" className="text-xs mt-1">{order.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.technicianName ? (
                      <p className="font-medium">{order.technicianName}</p>
                    ) : (
                      <p className="text-gray-400 text-sm">Chưa có</p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm max-w-[150px]">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{order.address}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    ₫{order.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order.createdAt}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và tiến độ xử lý
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trạng thái hiện tại</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Giá trị đơn</p>
                  <p className="text-2xl text-green-600">₫{selectedOrder.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Customer & Technician */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Tên:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-600">SĐT:</span> {selectedOrder.customerPhone}</p>
                    <p className="flex items-start gap-1">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="flex-1">{selectedOrder.address}</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Thông tin thợ</h4>
                  {selectedOrder.technicianName ? (
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Tên:</span> {selectedOrder.technicianName}</p>
                      <Badge className="bg-green-500">Đã nhận việc</Badge>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Chưa có thợ nhận việc</p>
                  )}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Thông tin dịch vụ</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Loại dịch vụ</p>
                    <p className="font-medium">{selectedOrder.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Danh mục</p>
                    <Badge>{selectedOrder.category}</Badge>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedOrder.aiAnalysis && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    <h4 className="font-medium">Phân tích của AI</h4>
                  </div>
                  <p className="text-sm text-gray-700">{selectedOrder.aiAnalysis}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Tiến trình</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Tạo đơn</p>
                      <p className="text-xs text-gray-500">{selectedOrder.createdAt}</p>
                    </div>
                  </div>
                  {selectedOrder.startedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Bắt đầu làm việc</p>
                        <p className="text-xs text-gray-500">{selectedOrder.startedAt}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Hoàn thành</p>
                        <p className="text-xs text-gray-500">{selectedOrder.completedAt}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.estimatedCompletion && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Dự kiến hoàn thành</p>
                        <p className="text-xs text-gray-500">{selectedOrder.estimatedCompletion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
