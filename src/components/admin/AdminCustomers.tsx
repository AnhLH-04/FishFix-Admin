import { useState, useEffect, useMemo } from "react";
import { Search, Filter, MoreVertical, Eye, Lock, Unlock, UserX, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { getAllUsers, UserDto } from "../../services/userService";

interface Customer {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleId: number;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await getAllUsers();
      // Filter to show only customers (roleId = 2), exclude admins (roleId = 3) and workers (roleId = 1 if applicable)
      const customerUsers = users.filter((u) => u.roleId !== 3);
      setCustomers(
        customerUsers.map((u) => ({
          userId: u.userId,
          fullName: u.fullName || "Chưa cập nhật",
          phone: u.phone,
          email: u.email,
          isActive: u.isActive,
          createdAt: u.createdAt,
          roleId: u.roleId,
        })),
      );
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && customer.isActive) ||
      (statusFilter === "inactive" && !customer.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary">Không hoạt động</Badge>
    );
  };

  const getRoleBadge = (roleId: number) => {
    switch (roleId) {
      case 1:
        return <Badge className="bg-blue-500">Thợ</Badge>;
      case 2:
        return <Badge className="bg-purple-500">Khách hàng</Badge>;
      case 3:
        return <Badge className="bg-orange-500">Admin</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadCustomers}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Người Dùng</h1>
          <p className="text-gray-600">Tổng {customers.length} người dùng</p>
        </div>
        <Button onClick={loadCustomers} variant="outline">
          Làm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Tổng người dùng</p>
            <p className="text-3xl text-blue-600">{customers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Đang hoạt động</p>
            <p className="text-3xl text-green-600">{customers.filter((c) => c.isActive).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Khách hàng</p>
            <p className="text-3xl text-purple-600">{customers.filter((c) => c.roleId === 2).length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Thợ sửa chữa</p>
            <p className="text-3xl text-blue-600">{customers.filter((c) => c.roleId === 1).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Người dùng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead className="text-center">Vai trò</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.userId} className="hover:bg-blue-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                          {customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{customer.fullName}</p>
                          <p className="text-sm text-gray-500">ID: {customer.userId.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{customer.phone}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getRoleBadge(customer.roleId)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(customer.isActive)}</TableCell>
                    <TableCell className="text-sm">{formatDate(customer.createdAt)}</TableCell>
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
                            {customer.isActive ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Khóa tài khoản
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4 mr-2" />
                                Mở khóa
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>Thông tin chi tiết của {selectedCustomer?.fullName}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-medium">{selectedCustomer.fullName}</p>
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
                  <p className="text-sm text-gray-600">Vai trò</p>
                  {getRoleBadge(selectedCustomer.roleId)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tham gia</p>
                  <p className="font-medium">{formatDate(selectedCustomer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  {getStatusBadge(selectedCustomer.isActive)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
