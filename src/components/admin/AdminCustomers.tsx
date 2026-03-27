import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  Loader2,
  Lock,
  MoreVertical,
  RefreshCw,
  Search,
  Unlock,
  Users,
  Wrench,
  Crown,
  Shield,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription as DialogDesc, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { adminApi, identityApi } from "../../services/api";
import { cn } from "../ui/utils";

type Customer = {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleId: number;
  totalOrders: number;
  totalSpent: number;
};

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function formatCurrency(n: number) {
  return `₫${Math.round(n || 0).toLocaleString("vi-VN")}`;
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("vi-VN");
  } catch {
    return "—";
  }
}

function roleMeta(roleId: number) {
  switch (roleId) {
    case 1:
      return { label: "Khách hàng", badgeClass: "bg-blue-500", icon: Users };
    case 2:
      return { label: "Thợ", badgeClass: "bg-purple-500", icon: Wrench };
    case 3:
      return { label: "Admin", badgeClass: "bg-orange-500", icon: Shield };
    default:
      return { label: "Khác", badgeClass: "bg-gray-500", icon: Users };
  }
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? <Badge className="bg-green-500">Hoạt động</Badge> : <Badge variant="secondary">Bị khóa</Badge>;
}

function RoleBadge({ roleId }: { roleId: number }) {
  const meta = roleMeta(roleId);
  return <Badge className={meta.badgeClass}>{meta.label}</Badge>;
}

function normalizeArray<T = any>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.items)) return data.items as T[];
  if (Array.isArray(data?.data)) return data.data as T[];
  if (Array.isArray(data?.result)) return data.result as T[];
  return [];
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "1" | "2" | "3">("all");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, bookingsRes] = await Promise.all([identityApi.getUsers(), adminApi.getAdminBookings()]);
      const users = normalizeArray<any>(usersRes);
      const bookings = normalizeArray<any>(bookingsRes);

      const enriched: Customer[] = users.map((u) => {
        const userBookings = bookings.filter((b) => b?.customerId === u?.userId);
        const paidOrCompleted = userBookings.filter((b) => {
          const st = String(b?.status ?? "").toLowerCase();
          return st === "paid" || st === "completed";
        });

        const totalOrders = paidOrCompleted.length;
        const totalSpent = paidOrCompleted.reduce((sum: number, b: any) => {
          const v = typeof b?.finalAmount === "number" ? b.finalAmount : typeof b?.amount === "number" ? b.amount : 0;
          return sum + (Number.isFinite(v) ? v : 0);
        }, 0);

        return {
          userId: String(u?.userId || ""),
          fullName: u?.fullName || "Chưa cập nhật",
          phone: u?.phone || "",
          email: u?.email || "",
          isActive: Boolean(u?.isActive),
          createdAt: u?.createdAt || "",
          roleId: Number(u?.roleId || 0),
          totalOrders,
          totalSpent,
        };
      });

      setCustomers(enriched);
    } catch (e) {
      console.error(e);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return customers.filter((c) => {
      const matchSearch = !q || `${c.fullName} ${c.phone} ${c.email}`.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.isActive) ||
        (statusFilter === "inactive" && !c.isActive);
      const matchRole = roleFilter === "all" || String(c.roleId) === roleFilter;
      return matchSearch && matchStatus && matchRole;
    });
  }, [customers, searchTerm, statusFilter, roleFilter]);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.isActive).length;
    const vip = customers.filter((c) => c.totalSpent >= 5_000_000).length;
    // Cùng nguồn với cột “Vai trò”: Identity roleId = 2 (Thợ). Dispatch /api/dispatch/workers có thể ít hơn nếu chưa tạo hồ sơ thợ.
    const workers = customers.filter((c) => c.roleId === 2).length;
    return { total, active, vip, workers };
  }, [customers]);

  const comingSoon = useCallback((label: string) => {
    toast.message(label, { description: "Chức năng này cần endpoint backend để thực thi." });
  }, []);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-sm text-gray-600">
            Tổng <span className="font-semibold text-gray-900">{stats.total}</span> người dùng •{" "}
            <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> đang hiển thị
          </p>
        </div>

        <Button variant="outline" onClick={loadData} disabled={loading} className="rounded-xl">
          <motion.span
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 0.9, ease: "linear", repeat: Infinity } : { duration: 0.2 }}
            className="mr-2 inline-flex"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.span>
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      {/* Stats (giữ palette cũ) */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 md:grid-cols-4"
      >
        {[
          { title: "Tổng người dùng", value: stats.total, tone: "text-blue-600", icon: Users },
          { title: "Đang hoạt động", value: stats.active, tone: "text-green-600", icon: Users },
          { title: "Khách VIP", value: stats.vip, tone: "text-purple-600", icon: Crown },
          { title: "Thợ sửa chữa", value: stats.workers, tone: "text-blue-600", icon: Wrench },
        ].map((s) => (
          <motion.div
            key={s.title}
            variants={cardVariants}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">{s.title}</div>
                    <div className={cn("text-3xl font-semibold tracking-tight", s.tone)}>{s.value}</div>
                  </div>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50">
                    <s.icon className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm theo tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl pl-10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={roleFilter} onValueChange={(v: string) => setRoleFilter(v as any)}>
                <SelectTrigger className="h-11 w-full rounded-xl sm:w-44">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="1">Khách hàng</SelectItem>
                  <SelectItem value="2">Thợ</SelectItem>
                  <SelectItem value="3">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as any)}>
                <SelectTrigger className="h-11 w-full rounded-xl sm:w-44">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Danh sách người dùng</CardTitle>
            </div>
            <Badge variant="outline" className="rounded-full">
              {filteredCustomers.length} kết quả
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                {loading ? (
                  Array.from({ length: 7 }, (_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                          <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                          <div className="h-3 w-44 animate-pulse rounded bg-gray-100" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="mx-auto h-6 w-12 animate-pulse rounded-full bg-gray-100" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="ml-auto h-4 w-24 animate-pulse rounded bg-gray-100" />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="mx-auto h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="mx-auto h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="mx-auto h-9 w-9 animate-pulse rounded-xl bg-gray-100" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                          <Loader2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold">Không thể tải dữ liệu</div>
                          <div className="text-sm text-gray-600">{error}</div>
                        </div>
                        <Button onClick={loadData} className="rounded-xl">
                          Thử lại
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                          <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold">Không có dữ liệu</div>
                          <div className="text-sm text-gray-600">Thử đổi từ khóa hoặc bộ lọc.</div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((c, idx) => (
                    <motion.tr
                      key={c.userId}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx, 10) * 0.03, ease: "easeOut" }}
                      className="border-b hover:bg-gray-50/60"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{c.fullName}</p>
                          <p className="text-xs text-gray-500">ID: {c.userId.slice(0, 8)}...</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p>{c.phone || "—"}</p>
                        <p className="text-xs text-gray-500">{c.email || "—"}</p>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="rounded-full">
                          {c.totalOrders}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(c.totalSpent)}
                      </TableCell>

                      <TableCell className="text-center">
                        <RoleBadge roleId={c.roleId} />
                      </TableCell>

                      <TableCell className="text-center">
                        <StatusBadge active={c.isActive} />
                      </TableCell>

                      <TableCell>{c.createdAt ? formatDate(c.createdAt) : "—"}</TableCell>

                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedCustomer(c)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => comingSoon(c.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản")}
                            >
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
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <AnimatePresence>
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-xl rounded-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
              <DialogDesc>Thông tin tổng quan & giao dịch.</DialogDesc>
            </DialogHeader>

            {selectedCustomer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">{selectedCustomer.fullName}</div>
                    <div className="text-sm text-gray-600">{selectedCustomer.email || "—"}</div>
                    <div className="text-sm text-gray-600">{selectedCustomer.phone || "—"}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <RoleBadge roleId={selectedCustomer.roleId} />
                    <StatusBadge active={selectedCustomer.isActive} />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs text-gray-600">Tổng đơn (paid/completed)</div>
                    <div className="mt-1 text-xl font-semibold">{selectedCustomer.totalOrders}</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="text-xs text-gray-600">Tổng chi tiêu</div>
                    <div className="mt-1 text-xl font-semibold text-green-600">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl bg-gray-50 p-3">
                    <div className="text-xs text-gray-600">Ngày tham gia</div>
                    <div className="mt-1 text-sm font-medium">
                      {selectedCustomer.createdAt ? formatDate(selectedCustomer.createdAt) : "—"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 break-all">ID: {selectedCustomer.userId}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => setSelectedCustomer(null)}>
                    Đóng
                  </Button>
                  <Button className="rounded-xl" onClick={() => comingSoon("Xem booking của user")}>
                    Xem booking
                  </Button>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </motion.div>
  );
}
