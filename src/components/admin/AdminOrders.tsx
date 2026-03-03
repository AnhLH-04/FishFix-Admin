import { useEffect, useMemo, useState } from "react";
import { Search, Eye, MapPin, Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

// 🔧 đổi path này theo project bạn
import { adminApi, identityApi, workerApi, jobApi, categoryApi } from "../../services/api";

type ApiBooking = any;
type ApiUser = any;
type ApiWorker = any;
type ApiJob = any;
type ApiCategory = any;

type UiOrderStatus = "finding" | "in_progress" | "completed" | "cancelled";

type UiOrder = {
  id: string; // hiển thị kiểu #xxxx
  bookingId: string;

  customerId?: string | null;
  customerName: string;
  customerPhone: string;

  technicianId?: string | null;
  technicianName: string | null;

  service: string;
  category: string;
  address: string;

  amount: number;

  status: UiOrderStatus;

  aiAnalysis: string | null;
  images: string[];

  createdAt: string;
  startedAt: string | null;
  completedAt?: string | null;
  estimatedCompletion: string | null;
};

// ---------------- helpers ----------------
function asArray(payload: any): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.result)) return payload.result;
  return [];
}

function safeStr(v: any, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  return String(v);
}

function formatMoneyVnd(amount: number) {
  const n = Number.isFinite(amount) ? amount : 0;
  return `₫${Math.round(n).toLocaleString("vi-VN")}`;
}

function formatDateTimeVi(input: any): string {
  // input có thể là ISO string/date
  const d = input ? new Date(input) : null;
  if (!d || !Number.isFinite(d.getTime())) return "";
  return d.toLocaleString("vi-VN");
}

function shortCodeFromId(id: string) {
  // # + 4-6 ký tự cho đẹp UI
  const s = (id || "").replace(/-/g, "");
  return `#${s.slice(0, 5).toUpperCase() || "----"}`;
}

function mapBookingStatusToUi(statusRaw: any): UiOrderStatus {
  const s = safeStr(statusRaw, "").toLowerCase().replace(/\s+/g, "");

  // backend có thể trả: pending/created/finding/awaiting...
  if (
    s.includes("finding") ||
    s.includes("pending") ||
    s.includes("await") ||
    s.includes("created") ||
    s.includes("new")
  ) {
    return "finding";
  }

  // in progress
  if (
    s.includes("inprogress") ||
    s.includes("progress") ||
    s.includes("working") ||
    s.includes("assigned") ||
    s.includes("accepted")
  ) {
    return "in_progress";
  }

  // completed
  if (s.includes("completed") || s.includes("complete") || s.includes("done") || s.includes("finished")) {
    return "completed";
  }

  // cancelled
  if (s.includes("cancel") || s.includes("rejected") || s.includes("reject") || s.includes("failed")) {
    return "cancelled";
  }

  // fallback
  return "finding";
}

function mapUiStatusToApi(statusFilter: string): string | undefined {
  // IMPORTANT: swagger chỉ nói status là string, không nói enum.
  // Nên mình gửi 1 số giá trị "phổ biến". Nếu backend bạn dùng khác,
  // bạn chỉ cần đổi các string bên dưới cho khớp.
  switch (statusFilter) {
    case "finding":
      // ví dụ backend hay dùng: Pending / Created
      return "Pending";
    case "in_progress":
      return "InProgress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return undefined;
  }
}

function pickBookingId(b: ApiBooking): string {
  return safeStr(b?.bookingId ?? b?.id ?? b?.BookingId ?? "");
}

function pickJobId(b: ApiBooking): string | null {
  const v = b?.jobId ?? b?.JobId ?? null;
  return v ? String(v) : null;
}

function pickCustomerId(b: ApiBooking): string | null {
  const v = b?.customerId ?? b?.CustomerId ?? null;
  return v ? String(v) : null;
}

function pickWorkerId(b: ApiBooking): string | null {
  const v = b?.workerId ?? b?.WorkerId ?? null;
  return v ? String(v) : null;
}

function pickAmount(b: ApiBooking): number {
  const v =
    typeof b?.finalAmount === "number"
      ? b.finalAmount
      : typeof b?.amount === "number"
        ? b.amount
        : typeof b?.totalCost === "number"
          ? b.totalCost
          : 0;
  return Number.isFinite(v) ? v : 0;
}

function pickCreatedAt(b: ApiBooking): any {
  return b?.createdAt ?? b?.CreatedAt ?? b?.createdTime ?? null;
}

function pickStartedAt(b: ApiBooking): any {
  return b?.startedAt ?? b?.StartedAt ?? null;
}

function pickCompletedAt(b: ApiBooking): any {
  return b?.completedAt ?? b?.CompletedAt ?? null;
}

function pickEstimatedCompletion(b: ApiBooking): any {
  return b?.estimatedCompletion ?? b?.EstimatedCompletion ?? null;
}

function pickAiAnalysis(b: ApiBooking): string | null {
  // backend có thể chưa có field này -> null
  const v = b?.aiAnalysis ?? b?.diagnosisSummary ?? b?.notes ?? null;
  return typeof v === "string" && v.trim() ? v : null;
}

function pickImages(b: ApiBooking): string[] {
  // swagger UpdateBookingStatusRequest có "images" là string (có thể là JSON string / csv) :contentReference[oaicite:5]{index=5}
  const v = b?.images ?? b?.Images ?? null;
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  if (typeof v === "string") {
    // thử parse JSON array
    try {
      const arr = JSON.parse(v);
      if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string");
    } catch {
      // fallback split
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function userName(u: ApiUser): string {
  return safeStr(u?.fullName ?? u?.FullName ?? u?.name ?? u?.email ?? u?.phone ?? "Không rõ");
}

function userPhone(u: ApiUser): string {
  return safeStr(u?.phone ?? u?.Phone ?? "");
}

function workerName(w: ApiWorker): string {
  return safeStr(w?.fullName ?? w?.FullName ?? w?.name ?? "Chưa có");
}

function categoryNameById(categories: ApiCategory[], categoryId: any): string {
  const idNum = Number(categoryId);
  const found = categories.find((c) => Number(c?.categoryId ?? c?.id) === idNum);
  return safeStr(found?.name ?? found?.categoryName ?? found?.title ?? "", "");
}

// ---------------- component ----------------
export function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<UiOrder | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<UiOrder[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) load master data
        const [usersPayload, workersPayload, categoriesPayload] = await Promise.all([
          identityApi.getUsers(), // GET /api/identity/users :contentReference[oaicite:6]{index=6}
          workerApi.getWorkers(), // GET /api/dispatch/workers :contentReference[oaicite:7]{index=7}
          categoryApi.getCategories?.({ activeOnly: true }) ?? categoryApi.getCategories?.() ?? Promise.resolve([]), // GET /api/categories :contentReference[oaicite:8]{index=8}
        ]);

        const users = asArray(usersPayload);
        const workers = asArray(workersPayload);
        const categories = asArray(categoriesPayload);

        const userById = new Map<string, ApiUser>();
        for (const u of users) {
          const id = safeStr(u?.userId ?? u?.id ?? "");
          if (id) userById.set(id, u);
        }

        const workerById = new Map<string, ApiWorker>();
        for (const w of workers) {
          const id = safeStr(w?.workerId ?? w?.id ?? "");
          if (id) workerById.set(id, w);
        }

        // 2) load bookings (admin)
        const apiStatus = mapUiStatusToApi(statusFilter);
        const bookingsPayload = await adminApi.getAdminBookings(apiStatus ? { status: apiStatus } : undefined);
        const bookings = asArray(bookingsPayload) as ApiBooking[];

        // 3) load jobs for bookings (để có service/category/address)
        const jobIds = Array.from(
          new Set(
            bookings
              .map((b) => pickJobId(b))
              .filter((x): x is string => Boolean(x)),
          ),
        );

        // giới hạn để tránh quá nhiều request (tuỳ bạn tăng)
        const MAX_JOB_FETCH = 80;
        const jobIdLimited = jobIds.slice(0, MAX_JOB_FETCH);

        const jobsList = await Promise.all(
          jobIdLimited.map(async (jobId) => {
            try {
              const job = await jobApi.getJob(jobId); // GET /api/jobs/{jobId} :contentReference[oaicite:9]{index=9}
              return { jobId, job };
            } catch {
              return { jobId, job: null };
            }
          }),
        );

        const jobById = new Map<string, ApiJob>();
        for (const it of jobsList) {
          if (it.job) jobById.set(it.jobId, it.job);
        }

        // 4) map -> UI orders
        const uiOrders: UiOrder[] = bookings.map((b) => {
          const bookingId = pickBookingId(b);
          const customerId = pickCustomerId(b);
          const workerId = pickWorkerId(b);

          const u = customerId ? userById.get(customerId) : undefined;
          const w = workerId ? workerById.get(workerId) : undefined;

          const jobId = pickJobId(b);
          const job = jobId ? jobById.get(jobId) : undefined;

          const service = safeStr(job?.title ?? job?.Title ?? b?.title ?? b?.service ?? "Dịch vụ", "Dịch vụ");
          const category =
            categoryNameById(categories, job?.categoryId ?? job?.CategoryId ?? b?.categoryId ?? b?.CategoryId) ||
            safeStr(job?.categoryName ?? b?.categoryName ?? "", "") ||
            "N/A";

          const addrParts = [
            job?.address ?? b?.address,
            job?.ward ?? b?.ward,
            job?.district ?? b?.district,
            job?.city ?? b?.city,
          ]
            .map((x) => safeStr(x, "").trim())
            .filter(Boolean);

          const address = addrParts.join(", ") || safeStr(job?.address ?? b?.address ?? "N/A", "N/A");

          const createdAt = formatDateTimeVi(pickCreatedAt(b) ?? b?.scheduledDate ?? null) || "";
          const startedAt = pickStartedAt(b) ? formatDateTimeVi(pickStartedAt(b)) : null;
          const completedAt = pickCompletedAt(b) ? formatDateTimeVi(pickCompletedAt(b)) : null;
          const estimatedCompletion = pickEstimatedCompletion(b) ? formatDateTimeVi(pickEstimatedCompletion(b)) : null;

          const statusUi = mapBookingStatusToUi(b?.status ?? b?.Status);

          return {
            id: shortCodeFromId(bookingId),
            bookingId,

            customerId,
            customerName: u ? userName(u) : safeStr(b?.customerName ?? "Không rõ"),
            customerPhone: u ? userPhone(u) : safeStr(b?.customerPhone ?? ""),

            technicianId: workerId,
            technicianName: w ? workerName(w) : workerId ? "Đã gán thợ" : null,

            service,
            category,
            address,

            amount: pickAmount(b),

            status: statusUi,

            aiAnalysis: pickAiAnalysis(b),
            images: pickImages(b),

            createdAt,
            startedAt,
            completedAt,
            estimatedCompletion,
          };
        });

        setOrders(uiOrders);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Load orders failed");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [statusFilter]);

  const getStatusBadge = (status: UiOrderStatus) => {
    switch (status) {
      case "finding":
        return (
          <Badge className="bg-orange-500 flex items-center gap-1">
            <Loader className="w-3 h-3 animate-spin" />
            Đang tìm thợ
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Đang làm
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Hoàn thành
          </Badge>
        );
      case "cancelled":
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

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.bookingId.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerPhone.toLowerCase().includes(term) ||
        order.service.toLowerCase().includes(term) ||
        order.category.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      finding: orders.filter((o) => o.status === "finding").length,
      in_progress: orders.filter((o) => o.status === "in_progress").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-600">Theo dõi và quản lý tất cả yêu cầu sửa chữa</p>
      </div>

      {/* Loading / Error */}
      {error && <div className="text-sm text-red-600">Lỗi: {error}</div>}

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      Đang tải dữ liệu...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.bookingId} className="hover:bg-blue-50 transition-colors">
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
                        <Badge variant="outline" className="text-xs mt-1">
                          {order.category}
                        </Badge>
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
                    <TableCell className="font-medium text-green-600">{formatMoneyVnd(order.amount)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{order.createdAt}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Thông tin chi tiết và tiến độ xử lý</DialogDescription>
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
                  <p className="text-2xl text-green-600">{formatMoneyVnd(selectedOrder.amount)}</p>
                </div>
              </div>

              {/* Customer & Technician */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Tên:</span> {selectedOrder.customerName}
                    </p>
                    <p>
                      <span className="text-gray-600">SĐT:</span> {selectedOrder.customerPhone}
                    </p>
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
                      <p>
                        <span className="text-gray-600">Tên:</span> {selectedOrder.technicianName}
                      </p>
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