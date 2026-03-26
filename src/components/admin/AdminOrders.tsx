import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Eye, MapPin, Clock, Loader, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "../ui/utils";

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
  /** Chuỗi status thô từ API — dùng để badge khớp AdminPayments */
  apiStatus: string;

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

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.015, duration: 0.25, ease: "easeOut" as const },
  }),
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

  // Đã thanh toán / hoàn thành — PHẢI trước nhánh pending (paid không chứa "completed" nhưng là trạng thái cuối)
  if (
    s.includes("paid") ||
    s.includes("completed") ||
    s.includes("complete") ||
    s.includes("done") ||
    s.includes("finished")
  ) {
    return "completed";
  }

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

  // thợ đã tới địa chỉ (API hay trả Arrived)
  if (s.includes("arrived") || s.includes("arrive")) {
    return "in_progress";
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

  // cancelled
  if (s.includes("cancel") || s.includes("rejected") || s.includes("reject") || s.includes("failed")) {
    return "cancelled";
  }

  // fallback — không đoán "đang tìm thợ" cho mọi giá trị lạ
  return "finding";
}

/** Badge cột Trạng thái — cùng logic ưu tiên như AdminPayments.getStatusBadge, rồi mới tới trạng thái đơn hàng chi tiết */
function getStatusBadgeFromApi(statusRaw: unknown) {
  const raw = safeStr(statusRaw, "");
  const s = raw.toLowerCase();

  if (
    s.includes("paid") ||
    s.includes("completed") ||
    s.includes("complete") ||
    s.includes("done") ||
    s.includes("finished")
  ) {
    return <Badge className="bg-green-500 text-white hover:bg-green-600">Đã thanh toán</Badge>;
  }
  if (s.includes("pending") || s.includes("confirmed")) {
    return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Đang xử lý</Badge>;
  }
  if (
    s.includes("expired") ||
    s.includes("fail") ||
    s.includes("canceled") ||
    s.includes("cancel") ||
    s.includes("reject")
  ) {
    return <Badge className="bg-red-500 text-white hover:bg-red-600">Không thành công</Badge>;
  }

  if (s.includes("arrived") || s.includes("arrive")) {
    return (
      <Badge className="bg-indigo-500 flex items-center gap-1 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500">
        <MapPin className="w-3 h-3 shrink-0" />
        Đã đến nơi
      </Badge>
    );
  }

  if (s.includes("finding") || s.includes("await") || s.includes("created") || s.includes("new")) {
    return (
      <Badge className="bg-orange-500 flex items-center gap-1 text-white hover:bg-orange-600">
        <Loader className="w-3 h-3 animate-spin" />
        Đang tìm thợ
      </Badge>
    );
  }
  if (
    s.includes("inprogress") ||
    s.includes("progress") ||
    s.includes("working") ||
    s.includes("assigned") ||
    s.includes("accepted")
  ) {
    return (
      <Badge className="bg-blue-500 flex items-center gap-1 text-white hover:bg-blue-600">
        <Clock className="w-3 h-3" />
        Đang làm
      </Badge>
    );
  }

  return raw ? (
    <Badge variant="outline">{raw}</Badge>
  ) : (
    <Badge variant="outline">—</Badge>
  );
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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) load master data
      const [usersPayload, workersPayload, categoriesPayload] = await Promise.all([
        identityApi.getUsers(), // GET /api/identity/users
        workerApi.getWorkers(), // GET /api/dispatch/workers
        categoryApi.getCategories?.({ activeOnly: true }) ?? categoryApi.getCategories?.() ?? Promise.resolve([]), // GET /api/categories
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
            const job = await jobApi.getJob(jobId); // GET /api/jobs/{jobId}
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

        const apiStatus = safeStr(b?.status ?? b?.Status, "");
        const statusUi = mapBookingStatusToUi(apiStatus);

        return {
          id: shortCodeFromId(bookingId),
          bookingId,
          apiStatus,

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
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 animate-slide-up"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Quản Lý Đơn Hàng</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Theo dõi và quản lý tất cả yêu cầu sửa chữa</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={load}
            disabled={loading}
            className="border-border/60 bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Loading / Error */}
      <AnimatePresence mode="popLayout">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
          >
            Lỗi: {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 md:grid-cols-5"
      >
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Card className="border-border/60 bg-background/60 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng đơn</CardTitle>
              <CardDescription className="text-xs">Tất cả yêu cầu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Card className="border-border/60 bg-linear-to-br from-orange-50 to-amber-50 shadow-lg dark:from-orange-950/30 dark:to-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Đang tìm thợ</CardTitle>
              <CardDescription className="text-xs">Chưa có thợ nhận</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-orange-600">{stats.finding}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Card className="border-border/60 bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg dark:from-blue-950/30 dark:to-cyan-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Đang làm</CardTitle>
              <CardDescription className="text-xs">Đang xử lý</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-blue-600">{stats.in_progress}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Card className="border-border/60 bg-linear-to-br from-green-50 to-emerald-50 shadow-lg dark:from-green-950/30 dark:to-emerald-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Hoàn thành</CardTitle>
              <CardDescription className="text-xs">Đã xong</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Card className="border-border/60 bg-linear-to-br from-red-50 to-rose-50 shadow-lg dark:from-red-950/30 dark:to-rose-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-200">Đã hủy</CardTitle>
              <CardDescription className="text-xs">Bị hủy/không thành công</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={cardVariants} initial="hidden" animate="show">
        <Card className="border-border/60 bg-background/60 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/40">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm theo mã đơn, khách hàng, dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/70 dark:bg-background/30"
                />
              </div>

              <div className="flex items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-56 bg-background/70 dark:bg-background/30">
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

                <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
                  {loading ? "Đang tải..." : `${filteredOrders.length} / ${orders.length} đơn`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div variants={cardVariants} initial="hidden" animate="show">
        <Card className="border-border/60 bg-background/60 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/40">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70 dark:bg-gray-900/30">
                  <TableHead className="pl-4">Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Thợ</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="pr-4 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600" />
                        Đang tải dữ liệu...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-gray-500 dark:text-gray-400">
                      Không có đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order.bookingId}
                      variants={rowVariants}
                      initial="hidden"
                      animate="show"
                      custom={idx}
                      whileHover={{ backgroundColor: "rgba(0, 123, 255, 0.06)" }}
                      className="border-b transition-colors"
                    >
                      <TableCell className="pl-4 font-medium text-[#007BFF]">{order.id}</TableCell>
                      <TableCell>
                        <div className="min-w-[180px]">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[170px]">
                          <p className="font-medium">{order.service}</p>
                          <Badge
                            variant="outline"
                            className="mt-1 text-xs bg-background/60 dark:bg-background/20"
                          >
                            {order.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        {order.technicianName ? (
                          <p className="font-medium">{order.technicianName}</p>
                        ) : (
                          <p className="text-sm text-gray-400">Chưa có</p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm max-w-[220px] whitespace-normal">
                        <div className="flex items-start gap-1">
                          <MapPin className="mt-0.5 h-3 w-3 text-gray-400 shrink-0" />
                          <span className="line-clamp-2 text-gray-700 dark:text-gray-200">{order.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">{formatMoneyVnd(order.amount)}</TableCell>
                      <TableCell className="text-center">{getStatusBadgeFromApi(order.apiStatus)}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-300">{order.createdAt}</TableCell>
                      <TableCell className="pr-4 text-center">
                        <motion.div whileTap={{ scale: 0.96 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          >
                            <Eye className="h-4 w-4 text-[#007BFF]" />
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

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
              <div className="flex items-center justify-between p-4 bg-gray-50/70 dark:bg-gray-900/30 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Trạng thái hiện tại</p>
                  {getStatusBadgeFromApi(selectedOrder.apiStatus)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Giá trị đơn</p>
                  <p className="text-2xl text-green-600">{formatMoneyVnd(selectedOrder.amount)}</p>
                </div>
              </div>

              {/* Customer & Technician */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 border border-border/60 rounded-xl bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40">
                  <h4 className="font-medium mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                    <p>
                      <span className="text-gray-600 dark:text-gray-300">Tên:</span> {selectedOrder.customerName}
                    </p>
                    <p>
                      <span className="text-gray-600 dark:text-gray-300">SĐT:</span> {selectedOrder.customerPhone}
                    </p>
                    <p className="flex items-start gap-1">
                      <span className="text-gray-600 dark:text-gray-300">Địa chỉ:</span>
                      <span className="flex-1">{selectedOrder.address}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-border/60 rounded-xl bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40">
                  <h4 className="font-medium mb-3">Thông tin thợ</h4>
                  {selectedOrder.technicianName ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600 dark:text-gray-300">Tên:</span> {selectedOrder.technicianName}
                      </p>
                      <Badge className="bg-green-500 text-white">Đã nhận việc</Badge>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Chưa có thợ nhận việc</p>
                  )}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4 border border-border/60 rounded-xl bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40">
                <h4 className="font-medium mb-3">Thông tin dịch vụ</h4>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Loại dịch vụ</p>
                    <p className="font-medium">{selectedOrder.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Danh mục</p>
                    <Badge>{selectedOrder.category}</Badge>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedOrder.aiAnalysis && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl dark:bg-purple-950/30 dark:border-purple-900/40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    <h4 className="font-medium">Phân tích của AI</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{selectedOrder.aiAnalysis}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="p-4 border border-border/60 rounded-xl bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40">
                <h4 className="font-medium mb-3">Tiến trình</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Tạo đơn</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.createdAt}</p>
                    </div>
                  </div>

                  {selectedOrder.startedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Bắt đầu làm việc</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.startedAt}</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Hoàn thành</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.completedAt}</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.estimatedCompletion && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Dự kiến hoàn thành</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedOrder.estimatedCompletion}</p>
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
    </motion.div>
  );
}