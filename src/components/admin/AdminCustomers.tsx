import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { identityApi, adminApi, UserItem, BookingItem } from "../../services/api";

type UserWithStats = UserItem & {
  totalOrders: number;
  totalSpent: number;
};

function asArray<T = any>(payload: any): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload.data)) return payload.data as T[];
  if (Array.isArray(payload.items)) return payload.items as T[];
  if (Array.isArray(payload.result)) return payload.result as T[];
  return [];
}

export function AdminCustomers() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const usersRes: any = await identityApi.getUsers();
      const bookingsRes: any = await adminApi.getAdminBookings({});

      const userList = asArray<UserItem>(usersRes);
      const bookingList = asArray<BookingItem>(bookingsRes);

      const enrichedUsers: UserWithStats[] = userList.map((user: any) => {
        // 🔥 lấy đúng userId (backend của bạn dùng userId)
        const uid = user?.userId ?? user?.id ?? null;

        const userBookings = uid
          ? bookingList.filter((b: any) => {
              const bid = b?.customerId ?? b?.userId ?? b?.customerUserId ?? b?.createdBy ?? null;

              return bid === uid;
            })
          : [];

        const completedBookings = userBookings.filter(
          (b: any) => b?.status === "completed" || b?.status === "Completed" || b?.status === 3,
        );

        const totalOrders = completedBookings.length;

        const totalSpent = completedBookings.reduce((sum: number, b: any) => {
          const amount =
            typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;

          return sum + amount;
        }, 0);

        return {
          ...user,
          totalOrders,
          totalSpent,
        };
      });

      setUsers(enrichedUsers);
    } catch (err) {
      console.error("Load users failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.fullName ?? ""} ${u.email ?? ""} ${u.phone ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const stats = {
    total: users.length,
    active: users.length,
    blocked: 0,
    vip: users.filter((u) => u.totalSpent > 5000000).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Quản Lý Người Dùng</h1>
        <p className="text-gray-600">Tổng {stats.total} khách hàng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Tổng khách hàng</p>
            <p className="text-3xl text-blue-600">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-3xl text-green-600">{stats.active}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Bị khóa</p>
            <p className="text-3xl text-red-600">{stats.blocked}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Khách VIP</p>
            <p className="text-3xl text-purple-600">{stats.vip}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, SĐT, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead className="text-center">Số đơn</TableHead>
                <TableHead className="text-right">Tổng chi tiêu</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: any) => (
                  <TableRow key={user.userId ?? user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.fullName || "Chưa cập nhật"}</p>
                        <p className="text-xs text-gray-500">ID: {user.userId ?? user.id}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p>{user.phone || "-"}</p>
                      <p className="text-xs text-gray-500">{user.email || "-"}</p>
                    </TableCell>

                    <TableCell className="text-center">{user.totalOrders}</TableCell>

                    <TableCell className="text-right font-medium text-green-600">
                      ₫{user.totalSpent.toLocaleString("vi-VN")}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge className="bg-green-500">Hoạt động</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
