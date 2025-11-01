import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Lock, Unlock, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const customers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    email: 'nguyenvana@email.com',
    address: 'Quận 1, TP.HCM',
    totalOrders: 12,
    totalSpent: '₫3,200,000',
    status: 'active',
    joinDate: '15/01/2024',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    phone: '0923456789',
    email: 'tranthib@email.com',
    address: 'Quận 2, TP.HCM',
    totalOrders: 8,
    totalSpent: '₫2,100,000',
    status: 'active',
    joinDate: '20/02/2024',
  },
  {
    id: 3,
    name: 'Lê Minh C',
    phone: '0934567890',
    email: 'leminhc@email.com',
    address: 'Quận 3, TP.HCM',
    totalOrders: 5,
    totalSpent: '₫1,500,000',
    status: 'blocked',
    joinDate: '10/03/2024',
  },
  {
    id: 4,
    name: 'Phạm Hoàng D',
    phone: '0945678901',
    email: 'phamhoangd@email.com',
    address: 'Quận 7, TP.HCM',
    totalOrders: 15,
    totalSpent: '₫4,800,000',
    status: 'active',
    joinDate: '05/01/2024',
  },
  {
    id: 5,
    name: 'Vũ Thu E',
    phone: '0956789012',
    email: 'vuthue@email.com',
    address: 'Quận 10, TP.HCM',
    totalOrders: 3,
    totalSpent: '₫850,000',
    status: 'inactive',
    joinDate: '25/04/2024',
  },
];

export function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Hoạt động</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500">Đã khóa</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Không hoạt động</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Người Dùng</h1>
          <p className="text-gray-600">Tổng {customers.length} khách hàng</p>
        </div>
        <Button className="bg-gradient-to-r from-[#007BFF] to-blue-600">
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Tổng khách hàng</p>
            <p className="text-3xl text-blue-600">{customers.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Đang hoạt động</p>
            <p className="text-3xl text-green-600">
              {customers.filter(c => c.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Bị khóa</p>
            <p className="text-3xl text-red-600">
              {customers.filter(c => c.status === 'blocked').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Khách VIP</p>
            <p className="text-3xl text-purple-600">
              {customers.filter(c => c.totalOrders > 10).length}
            </p>
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
                placeholder="Tìm kiếm theo tên, SĐT, email..."
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
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="blocked">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Lọc nâng cao
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead className="text-center">Số đơn</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-blue-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: #{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{customer.phone}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{customer.address}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{customer.totalOrders}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">{customer.totalSpent}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(customer.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {customer.status === 'blocked' ? (
                            <>
                              <Unlock className="w-4 h-4 mr-2" />
                              Mở khóa
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Khóa tài khoản
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <UserX className="w-4 h-4 mr-2" />
                          Xóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và lịch sử của {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ</p>
                  <p className="font-medium">{selectedCustomer.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tham gia</p>
                  <p className="font-medium">{selectedCustomer.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  {getStatusBadge(selectedCustomer.status)}
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Thống kê</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl text-blue-600">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                    <p className="text-2xl text-green-600">{selectedCustomer.totalSpent}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
