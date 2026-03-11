import { useEffect, useMemo, useState } from "react";
import { Search, MoreVertical, Eye, Lock, Unlock, Loader2 } from "lucide-react";

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

import { getAllUsers } from "../../services/userService";
import { adminApi } from "../../services/api";

interface Customer {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleId: number;
  totalOrders: number;
  totalSpent: number;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const users = await getAllUsers();
      const bookingsRes: any = await adminApi.getAdminBookings({});

      const bookingList = Array.isArray(bookingsRes?.data)
        ? bookingsRes.data
        : Array.isArray(bookingsRes)
          ? bookingsRes
          : [];

      const enrichedUsers: Customer[] = users.map((u: any) => {
        const userBookings = bookingList.filter((b: any) => b.customerId === u.userId);

        const completed = userBookings.filter(
          (b: any) => b.status === "completed" || b.status === "Completed" || b.status === 3,
        );

        const totalOrders = completed.length;

        const totalSpent = completed.reduce(
          (sum: number, b: any) =>
            sum + (typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0),
          0,
        );

        return {
          userId: u.userId,
          fullName: u.fullName || "Chưa cập nhật",
          phone: u.phone || "",
          email: u.email || "",
          isActive: u.isActive,
          createdAt: u.createdAt,
          roleId: u.roleId,
          totalOrders,
          totalSpent,
        };
      });

      setCustomers(enrichedUsers);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = `${c.fullName} ${c.phone} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.isActive) ||
        (statusFilter === "inactive" && !c.isActive);

      return matchSearch && matchStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

  const getRoleBadge = (roleId: number) => {
    switch (roleId) {
      case 1:
        return <Badge className="bg-blue-500">Thợ</Badge>;
      case 2:
        return <Badge className="bg-purple-500">Khách hàng</Badge>;
      case 3:
        return <Badge className="bg-orange-500">Admin</Badge>;
      default:
        return <Badge variant="outline">Khác</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) =>
    active ? <Badge className="bg-green-500">Hoạt động</Badge> : <Badge variant="secondary">Bị khóa</Badge>;

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
        <Button onClick={loadData}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
          <p className="text-gray-600">Tổng {customers.length} người dùng</p>
        </div>
        <Button onClick={loadData} variant="outline">
          Làm mới
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Tổng người dùng</p>
            <p className="text-3xl text-blue-600">{customers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-3xl text-green-600">{customers.filter((c) => c.isActive).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Khách VIP</p>
            <p className="text-3xl text-purple-600">{customers.filter((c) => c.totalSpent > 5000000).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Thợ sửa chữa</p>
            <p className="text-3xl text-blue-600">{customers.filter((c) => c.roleId === 1).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH + FILTER */}
      <Card>
        <CardContent className="p-6 flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
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
              <SelectItem value="inactive">Bị khóa</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Người dùng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead className="text-center">Số đơn</TableHead>
                <TableHead className="text-right">Tổng chi tiêu</TableHead>
                <TableHead className="text-center">Vai trò</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((c) => (
                  <TableRow key={c.userId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{c.fullName}</p>
                        <p className="text-xs text-gray-500">ID: {c.userId.slice(0, 8)}...</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p>{c.phone}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                    </TableCell>

                    <TableCell className="text-center">{c.totalOrders}</TableCell>

                    <TableCell className="text-right text-green-600 font-medium">
                      ₫{c.totalSpent.toLocaleString("vi-VN")}
                    </TableCell>

                    <TableCell className="text-center">{getRoleBadge(c.roleId)}</TableCell>

                    <TableCell className="text-center">{getStatusBadge(c.isActive)}</TableCell>

                    <TableCell>{formatDate(c.createdAt)}</TableCell>

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
                          <DropdownMenuItem onClick={() => setSelectedCustomer(c)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {c.isActive ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Khóa
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
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>Thông tin chi tiết</DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-2">
              <p>
                <strong>Họ tên:</strong> {selectedCustomer.fullName}
              </p>
              <p>
                <strong>SĐT:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Tổng đơn:</strong> {selectedCustomer.totalOrders}
              </p>
              <p>
                <strong>Tổng chi tiêu:</strong> ₫{selectedCustomer.totalSpent.toLocaleString("vi-VN")}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
