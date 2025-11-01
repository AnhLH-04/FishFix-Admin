import { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';

const complaints = [
  {
    id: 'CMP-1234',
    type: 'customer',
    orderId: '#1245',
    reporterName: 'Nguyễn Văn A',
    reporterPhone: '0912345678',
    subject: 'Thợ đến muộn 30 phút',
    description: 'Thợ đã đến muộn hơn 30 phút so với thời gian hẹn mà không thông báo trước.',
    technicianName: 'Trần Minh B',
    priority: 'medium',
    status: 'pending',
    createdAt: '29/10/2025 10:30',
  },
  {
    id: 'CMP-1233',
    type: 'technician',
    orderId: '#1244',
    reporterName: 'Lê Hoàng C',
    reporterPhone: '0923456789',
    subject: 'Khách hàng không thanh toán đủ',
    description: 'Đã hoàn thành công việc nhưng khách hàng chỉ thanh toán 80% số tiền đã thỏa thuận.',
    customerName: 'Phạm Thị D',
    priority: 'high',
    status: 'in_progress',
    createdAt: '29/10/2025 09:15',
    assignedTo: 'Admin A',
  },
  {
    id: 'CMP-1232',
    type: 'customer',
    orderId: '#1243',
    reporterName: 'Vũ Thu E',
    reporterPhone: '0934567890',
    subject: 'Chất lượng sửa chữa kém',
    description: 'Sau khi sửa xong 1 ngày, máy lạnh lại hỏng như cũ. Thợ không kiểm tra kỹ.',
    technicianName: 'Nguyễn Văn A',
    priority: 'high',
    status: 'resolved',
    createdAt: '28/10/2025 16:00',
    resolvedAt: '29/10/2025 08:30',
    resolution: 'Đã liên hệ thợ quay lại kiểm tra và sửa miễn phí. Khách hàng đồng ý.',
  },
  {
    id: 'CMP-1231',
    type: 'customer',
    orderId: '#1242',
    reporterName: 'Trần Minh F',
    reporterPhone: '0945678901',
    subject: 'Phí dịch vụ cao hơn báo giá',
    description: 'Báo giá ban đầu 300k nhưng sau khi làm xong yêu cầu thanh toán 450k.',
    technicianName: 'Lê Hoàng C',
    priority: 'medium',
    status: 'resolved',
    createdAt: '28/10/2025 14:20',
    resolvedAt: '28/10/2025 17:00',
    resolution: 'Đã xác minh, phí tăng do phải thay thêm linh kiện. Đã giải thích và khách hàng hiểu.',
  },
];

export function AdminSupport() {
  const [selectedComplaint, setSelectedComplaint] = useState<typeof complaints[0] | null>(null);
  const [resolution, setResolution] = useState('');

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Thấp</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-orange-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chưa xử lý
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Đang xử lý
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Đã giải quyết
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'customer' ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700">
        Từ khách hàng
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-purple-50 text-purple-700">
        Từ thợ
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Hỗ Trợ & Khiếu Nại</h1>
        <p className="text-gray-600">Xử lý và theo dõi các vấn đề từ người dùng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Tổng khiếu nại</p>
            <p className="text-3xl text-blue-600">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Chưa xử lý</p>
            <p className="text-3xl text-orange-600">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Đang xử lý</p>
            <p className="text-3xl text-blue-600">{stats.in_progress}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Đã giải quyết</p>
            <p className="text-3xl text-green-600">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1">
          <TabsTrigger value="all">
            Tất cả ({complaints.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Chưa xử lý ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Đang xử lý ({stats.in_progress})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Đã giải quyết ({stats.resolved})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {complaints.map((complaint) => (
            <Card 
              key={complaint.id} 
              className={`border-l-4 shadow-lg hover:shadow-xl transition-shadow ${
                complaint.priority === 'high' ? 'border-red-500' :
                complaint.priority === 'medium' ? 'border-orange-500' :
                'border-blue-500'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                      complaint.type === 'customer' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{complaint.subject}</h3>
                        {getPriorityBadge(complaint.priority)}
                        {getTypeBadge(complaint.type)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="font-medium text-[#007BFF]">{complaint.id}</span>
                        <span>•</span>
                        <span>Đơn: {complaint.orderId}</span>
                        <span>•</span>
                        <span>{complaint.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{complaint.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Người báo cáo: </span>
                          <span className="font-medium">{complaint.reporterName}</span>
                          <span className="text-gray-500"> ({complaint.reporterPhone})</span>
                        </div>
                        {complaint.type === 'customer' && complaint.technicianName && (
                          <>
                            <span>•</span>
                            <div>
                              <span className="text-gray-600">Thợ: </span>
                              <span className="font-medium">{complaint.technicianName}</span>
                            </div>
                          </>
                        )}
                        {complaint.type === 'technician' && complaint.customerName && (
                          <>
                            <span>•</span>
                            <div>
                              <span className="text-gray-600">Khách: </span>
                              <span className="font-medium">{complaint.customerName}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(complaint.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Chi tiết
                    </Button>
                  </div>
                </div>

                {complaint.status === 'resolved' && complaint.resolution && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Cách giải quyết:</p>
                    <p className="text-sm text-gray-900">{complaint.resolution}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Giải quyết lúc: {complaint.resolvedAt}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {complaints.filter(c => c.status === 'pending').length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              Không có khiếu nại nào chưa xử lý
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.filter(c => c.status === 'pending').map(complaint => (
                <Card key={complaint.id} className="border-l-4 border-orange-500 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-2">{complaint.subject}</h3>
                        <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{complaint.id}</span>
                          <span>•</span>
                          <span>{complaint.createdAt}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="bg-[#007BFF]"
                      >
                        Xử lý ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in_progress">
          {complaints.filter(c => c.status === 'in_progress').length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              Không có khiếu nại nào đang xử lý
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.filter(c => c.status === 'in_progress').map(complaint => (
                <Card key={complaint.id} className="border-l-4 border-blue-500 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-2">{complaint.subject}</h3>
                    <p className="text-sm text-gray-700 mb-3">{complaint.description}</p>
                    {complaint.assignedTo && (
                      <Badge className="bg-blue-500 mb-2">
                        Được giao cho: {complaint.assignedTo}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved">
          {complaints.filter(c => c.status === 'resolved').length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              Chưa có khiếu nại nào được giải quyết
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.filter(c => c.status === 'resolved').map(complaint => (
                <Card key={complaint.id} className="border-l-4 border-green-500 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-2">{complaint.subject}</h3>
                    <div className="bg-green-50 p-3 rounded-lg mb-2">
                      <p className="text-sm text-gray-700">{complaint.resolution}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Giải quyết: {complaint.resolvedAt}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết khiếu nại {selectedComplaint?.id}</DialogTitle>
            <DialogDescription>
              Xử lý và theo dõi tiến độ
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  {getStatusBadge(selectedComplaint.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Độ ưu tiên</p>
                  {getPriorityBadge(selectedComplaint.priority)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Loại</p>
                  {getTypeBadge(selectedComplaint.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-medium">{selectedComplaint.orderId}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Tiêu đề</p>
                <p className="font-medium mb-3">{selectedComplaint.subject}</p>
                <p className="text-sm text-gray-600 mb-1">Mô tả chi tiết</p>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.status !== 'resolved' && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Cách giải quyết</p>
                  <Textarea
                    placeholder="Nhập cách giải quyết khiếu nại..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {selectedComplaint.status === 'resolved' && selectedComplaint.resolution && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Đã giải quyết</p>
                  <p className="text-sm">{selectedComplaint.resolution}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedComplaint.resolvedAt}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
              Đóng
            </Button>
            {selectedComplaint?.status === 'pending' && (
              <Button className="bg-blue-500">
                Bắt đầu xử lý
              </Button>
            )}
            {selectedComplaint?.status === 'in_progress' && (
              <Button className="bg-green-500">
                Đánh dấu đã giải quyết
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
