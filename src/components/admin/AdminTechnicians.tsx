import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Eye, Star, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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

const technicians = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    skills: ['Điện', 'Nước'],
    area: 'Quận 1, 3, 5',
    rating: 4.9,
    totalJobs: 234,
    completionRate: 98,
    status: 'online',
    verified: true,
    joinDate: '10/01/2024',
    revenue: '₫15,200,000',
  },
  {
    id: 2,
    name: 'Trần Minh B',
    phone: '0923456789',
    skills: ['Máy lạnh'],
    area: 'Quận 2, 9',
    rating: 4.8,
    totalJobs: 189,
    completionRate: 96,
    status: 'busy',
    verified: true,
    joinDate: '15/01/2024',
    revenue: '₫12,800,000',
  },
  {
    id: 3,
    name: 'Lê Hoàng C',
    phone: '0934567890',
    skills: ['Máy giặt', 'Điện tử'],
    area: 'Quận 7, 10',
    rating: 5.0,
    totalJobs: 156,
    completionRate: 100,
    status: 'offline',
    verified: true,
    joinDate: '20/02/2024',
    revenue: '₫11,500,000',
  },
];

const pendingTechnicians = [
  {
    id: 4,
    name: 'Phạm Văn D',
    phone: '0945678901',
    skills: ['Điện'],
    area: 'Quận 4, 8',
    experience: '5 năm',
    certificates: ['Chứng chỉ điện công nghiệp'],
    applyDate: '28/10/2025',
  },
  {
    id: 5,
    name: 'Vũ Thị E',
    phone: '0956789012',
    skills: ['Nước', 'Máy lạnh'],
    area: 'Quận 6, 11',
    experience: '3 năm',
    certificates: ['Chứng chỉ sửa chữa điều hòa'],
    applyDate: '27/10/2025',
  },
];

export function AdminTechnicians() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<typeof technicians[0] | null>(null);
  const [selectedPending, setSelectedPending] = useState<typeof pendingTechnicians[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Online
          </Badge>
        );
      case 'busy':
        return <Badge className="bg-orange-500">Đang bận</Badge>;
      case 'offline':
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Thợ Sửa Chữa</h1>
          <p className="text-gray-600">Tổng {technicians.length} thợ đang hoạt động</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-orange-500 px-4 py-2">
            {pendingTechnicians.length} đơn chờ duyệt
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đang Online</p>
                <p className="text-3xl text-green-600">
                  {technicians.filter(t => t.status === 'online').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đang bận</p>
                <p className="text-3xl text-orange-600">
                  {technicians.filter(t => t.status === 'busy').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đã xác minh</p>
                <p className="text-3xl text-purple-600">
                  {technicians.filter(t => t.verified).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Rating TB</p>
                <p className="text-3xl text-blue-600">4.9</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-white shadow-lg p-1">
          <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007BFF] data-[state=active]:to-blue-600 data-[state=active]:text-white">
            Đang hoạt động ({technicians.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white">
            Chờ phê duyệt ({pendingTechnicians.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Technicians */}
        <TabsContent value="active" className="space-y-4">
          {/* Search */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, kỹ năng, khu vực..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Thợ</TableHead>
                    <TableHead>Kỹ năng</TableHead>
                    <TableHead>Khu vực</TableHead>
                    <TableHead className="text-center">Đánh giá</TableHead>
                    <TableHead className="text-center">Số việc</TableHead>
                    <TableHead>Doanh thu</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicians.map((tech) => (
                    <TableRow key={tech.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white relative">
                            {tech.name.charAt(0)}
                            {tech.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-sm text-gray-500">{tech.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {tech.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {tech.area}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{tech.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{tech.totalJobs}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">{tech.revenue}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(tech.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/technicians/${tech.id}`)}
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
        </TabsContent>

        {/* Pending Technicians */}
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingTechnicians.map((tech) => (
              <Card key={tech.id} className="border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl">
                        {tech.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">{tech.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{tech.phone}</p>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Kỹ năng</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {tech.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Khu vực</p>
                            <p className="text-sm mt-1">{tech.area}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Kinh nghiệm</p>
                            <p className="text-sm mt-1">{tech.experience}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Ngày đăng ký</p>
                            <p className="text-sm mt-1">{tech.applyDate}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Chứng chỉ</p>
                          {tech.certificates.map((cert) => (
                            <Badge key={cert} className="bg-blue-100 text-blue-700 mr-1">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPending(tech)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem
                      </Button>
                      <Button className="bg-green-500 hover:bg-green-600" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Phê duyệt
                      </Button>
                      <Button variant="destructive" size="sm">
                        <XCircle className="w-4 h-4 mr-2" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thợ sửa chữa</DialogTitle>
          </DialogHeader>
          {selectedTech && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-medium">{selectedTech.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{selectedTech.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kỹ năng</p>
                  <div className="flex gap-1 mt-1">
                    {selectedTech.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Khu vực phục vụ</p>
                  <p className="font-medium">{selectedTech.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tham gia</p>
                  <p className="font-medium">{selectedTech.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  {getStatusBadge(selectedTech.status)}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Thống kê hiệu suất</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-medium">{selectedTech.rating}</p>
                    <p className="text-sm text-gray-600">Đánh giá</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-medium text-blue-600">{selectedTech.totalJobs}</p>
                    <p className="text-sm text-gray-600">Việc hoàn thành</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-medium text-green-600">{selectedTech.completionRate}%</p>
                    <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
                <p className="text-3xl text-green-600">{selectedTech.revenue}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTech(null)}>
              Đóng
            </Button>
            <Button className="bg-red-500 hover:bg-red-600">
              Tạm khóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
