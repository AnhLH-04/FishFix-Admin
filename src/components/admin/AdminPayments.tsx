import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CreditCard, Download, DollarSign, TrendingUp } from "lucide-react";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi, identityApi, workerApi, jobApi, categoryApi } from "../../services/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type TimeFilter = "week" | "month" | "year";

type BookingLike = {
  bookingId?: string;
  jobId?: string;
  bidId?: string;
  customerId?: string;
  workerId?: string;
  finalAmount?: number | null;
  amount?: number | null;
  platformFee?: number | null;
  workerEarnings?: number | null;
  status?: string | null;
  title?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;

  // dates
  scheduledDate?: string | null; // YYYY-MM-DD
  scheduledAt?: string | null; // ISO
  scheduledTimeStart?: string | null; // HH:mm:ss
  scheduledTimeEnd?: string | null;
  actualStartTime?: string | null; // ISO
  actualEndTime?: string | null; // ISO
  createdAt?: string | null; // ISO
  updatedAt?: string | null; // ISO
  completedAt?: string | null; // ISO
};

type RevenuePoint = {
  date: string;
  revenue: number;
  commission: number;
  orders: number;
};

const PLATFORM_FEE_RATE = 0.05;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toYmd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function labelDDMM(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
}

function monthLabel(d: Date) {
  return `${pad2(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
}

function safeTime(s?: string | null) {
  if (!s) return NaN;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : NaN;
}

function pickBookingTime(b: BookingLike): number {
  // ưu tiên “thời điểm thực tế” nếu có, fallback sang scheduled/created
  const candidates = [
    b.actualStartTime,
    b.actualEndTime,
    b.completedAt,
    b.scheduledAt,
    b.scheduledDate,
    b.createdAt,
    b.updatedAt,
  ];
  for (const c of candidates) {
    const t = safeTime(c);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

/** Thời điểm “thanh toán” để lọc/nhóm chart: ưu tiên updatedAt (khi status → paid), rồi completedAt, actualEndTime, ... */
function pickPaymentTime(b: BookingLike): number {
  const candidates = [
    b.updatedAt,
    b.completedAt,
    b.actualEndTime,
    b.actualStartTime,
    b.scheduledAt,
    b.scheduledDate,
    b.createdAt,
  ];
  for (const c of candidates) {
    const t = safeTime(c);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

function isPaidRevenueBooking(b: BookingLike) {
  // Trang thanh toán: chỉ tính booking đã thanh toán = status "paid"
  const s = String(b.status ?? "")
    .trim()
    .toLowerCase();
  return s === "paid";
}

function getBookingAmount(b: BookingLike) {
  const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;
  return Number.isFinite(v) ? v : 0;
}

function formatVnd(value: number) {
  return `₫${value.toLocaleString("vi-VN")}`;
}

function formatBookingDate(booking: BookingLike) {
  const t = pickBookingTime(booking);
  if (!Number.isFinite(t)) return "—";
  const d = new Date(t);
  // ví dụ: 18:42 - 10/03/2026
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Mã giao dịch dạng #XXXXX giống AdminOrders */
function shortCodeFromId(id: string) {
  const s = (id || "").replace(/-/g, "");
  return `#${s.slice(0, 5).toUpperCase() || "----"}`;
}

function pickJobId(b: BookingLike): string | null {
  const v = b?.jobId ?? (b as Record<string, unknown>)?.JobId ?? null;
  return v ? String(v) : null;
}

function categoryNameById(
  categories: { categoryId?: number; id?: number; name?: string; categoryName?: string; title?: string }[],
  categoryId: unknown,
): string {
  const idNum = Number(categoryId);
  if (!Number.isFinite(idNum)) return "";
  const found = categories.find((c) => Number(c?.categoryId ?? c?.id) === idNum);
  return [found?.name, found?.categoryName, found?.title].find((x) => x != null && x !== "") as string ?? "";
}

function AnimatedNumber({
  value,
  format,
  className,
  suffix,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  suffix?: string;
}) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  const formatted = useTransform(spring, (latest) => {
    const v = Number.isFinite(latest) ? latest : 0;
    const i = Math.round(v);
    return format(i) + (suffix ?? "");
  });

  return <motion.span className={className}>{formatted}</motion.span>;
}

function asArray(payload: unknown): BookingLike[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as BookingLike[];
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as BookingLike[];
    if (Array.isArray(obj.items)) return obj.items as BookingLike[];
    if (Array.isArray(obj.result)) return obj.result as BookingLike[];
  }
  return [];
}

const pageFadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function AdminPayments() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [revenueInRange, setRevenueInRange] = useState(0);
  const [monthTransactions, setMonthTransactions] = useState(0);
  const [paidCountInRange, setPaidCountInRange] = useState(0);

  const [recentPayments, setRecentPayments] = useState<BookingLike[]>([]);
  const [usersList, setUsersList] = useState<{ userId?: string; fullName?: string | null }[]>([]);
  const [workersList, setWorkersList] = useState<{ workerId?: string; fullName?: string | null }[]>([]);
  const [categoriesList, setCategoriesList] = useState<
    { categoryId?: number; id?: number; name?: string; categoryName?: string; title?: string }[]
  >([]);
  const [jobsList, setJobsList] = useState<{ jobId: string; job: Record<string, unknown> | null }[]>([]);

  const userByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of usersList) {
      if (u.userId && (u.fullName != null && u.fullName !== "")) map.set(u.userId, u.fullName);
    }
    return map;
  }, [usersList]);

  const workerByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const w of workersList) {
      if (w.workerId && (w.fullName != null && w.fullName !== "")) map.set(w.workerId, w.fullName);
    }
    return map;
  }, [workersList]);

  const jobById = useMemo(() => {
    const map = new Map<string, Record<string, unknown>>();
    for (const { jobId, job } of jobsList) {
      if (jobId && job) map.set(jobId, job);
    }
    return map;
  }, [jobsList]);

  // Fetch bookings + users + workers + categories + jobs; compute totals for KPIs/charts.
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setRevenueData([]);
      setRevenueInRange(0);
      setMonthTransactions(0);
      setPaidCountInRange(0);
      setRecentPayments([]);
      setCategoriesList([]);
      setJobsList([]);

      try {
        const today = startOfDay(new Date());

        const rangeFrom =
          timeFilter === "week"
            ? addDays(today, -6)
            : timeFilter === "month"
              ? addDays(today, -29)
              : addDays(today, -364);

        const monthFrom = startOfMonth(today);
        const minFrom = rangeFrom.getTime() < monthFrom.getTime() ? rangeFrom : monthFrom;

        const scheduledFrom = toYmd(minFrom);
        const scheduledTo = toYmd(today);

        const [bookingsRangeRaw, bookingsAllRaw, usersRes, workersRes] = await Promise.all([
          adminApi.getAdminBookings({ scheduledFrom, scheduledTo }).catch(() => null),
          adminApi.getAdminBookings().catch(() => null),
          identityApi.getUsers().catch(() => []),
          workerApi.getWorkers().catch(() => []),
        ]);

        let bookingsRange: BookingLike[] = asArray(bookingsRangeRaw);
        let bookingsAll: BookingLike[] = asArray(bookingsAllRaw);
        if (!bookingsRange.length) bookingsRange = bookingsAll;
        setUsersList(Array.isArray(usersRes) ? usersRes : []);
        setWorkersList(Array.isArray(workersRes) ? workersRes : []);

        const toMsInclusive = addDays(today, 1).getTime();

        const inRangeByPaymentTime = (b: BookingLike, from: Date, toMs: number) => {
          const t = pickPaymentTime(b);
          return Number.isFinite(t) && t >= from.getTime() && t < toMs;
        };

        const paidAllTime = bookingsAll.filter(isPaidRevenueBooking);
        // Chart + bảng: lấy đơn “đã thanh toán trong khoảng” theo thời điểm thanh toán (updatedAt/...), không theo ngày lịch
        const paidRange = paidAllTime.filter((b) => inRangeByPaymentTime(b, rangeFrom, toMsInclusive));
        const paidThisMonth = paidAllTime.filter((b) => inRangeByPaymentTime(b, monthFrom, toMsInclusive));

        const revenueRange = paidRange.reduce((sum, b) => sum + getBookingAmount(b), 0);
        const safeRevenueRange = Number.isFinite(revenueRange) ? revenueRange : 0;

        setMonthTransactions(paidThisMonth.length);
        setPaidCountInRange(paidRange.length);
        setRevenueInRange(safeRevenueRange);

        // Recent payments: sắp theo thời điểm thanh toán (mới nhất trước)
        const recent = [...paidRange].sort((a, b) => pickPaymentTime(b) - pickPaymentTime(a)).slice(0, 10);
        setRecentPayments(recent);

        // Lấy categories + jobs để hiển thị tên dịch vụ + category như AdminOrders
        const jobIds = [
          ...new Set(
            paidRange
              .map((b) => pickJobId(b))
              .filter((x): x is string => Boolean(x)),
          ),
        ];
        const categoriesPayload = await (categoryApi.getCategories?.({ activeOnly: true }) ??
          categoryApi.getCategories?.() ??
          Promise.resolve([])).catch(() => []);
        const MAX_JOB_FETCH = 60;
        const jobsFetched = await Promise.all(
          jobIds.slice(0, MAX_JOB_FETCH).map(async (jobId) => {
            try {
              const job = await jobApi.getJob(jobId);
              return { jobId, job: job as Record<string, unknown> };
            } catch {
              return { jobId, job: null };
            }
          }),
        );
        setCategoriesList(Array.isArray(categoriesPayload) ? categoriesPayload : []);
        setJobsList(jobsFetched);

        const points: RevenuePoint[] = [];

        if (timeFilter === "year") {
          const map = new Map<string, { d: Date; revenue: number; orders: number }>();
          for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            map.set(key, { d, revenue: 0, orders: 0 });
          }

          for (const b of paidRange) {
            const t = pickPaymentTime(b);
            if (!Number.isFinite(t)) continue;
            const d = new Date(t);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            const cell = map.get(key);
            if (!cell) continue;
            cell.revenue += getBookingAmount(b);
            cell.orders += 1;
          }

          for (const [, v] of map) {
            points.push({
              date: monthLabel(v.d),
              revenue: v.revenue,
              commission: Math.round(v.revenue * PLATFORM_FEE_RATE),
              orders: v.orders,
            });
          }
        } else {
          const days = timeFilter === "week" ? 7 : 30;
          const map = new Map<string, { d: Date; revenue: number; orders: number }>();

          for (let i = 0; i < days; i++) {
            const d = addDays(rangeFrom, i);
            map.set(toYmd(d), { d, revenue: 0, orders: 0 });
          }

          for (const b of paidRange) {
            const t = pickPaymentTime(b);
            if (!Number.isFinite(t)) continue;
            const d = new Date(t);
            const key = toYmd(d);
            const cell = map.get(key);
            if (!cell) continue;
            cell.revenue += getBookingAmount(b);
            cell.orders += 1;
          }

          for (const [, v] of map) {
            points.push({
              date: labelDDMM(v.d),
              revenue: v.revenue,
              commission: Math.round(v.revenue * PLATFORM_FEE_RATE),
              orders: v.orders,
            });
          }
        }

        setRevenueData(points);
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } }; message?: string };
        setError(err?.response?.data?.message || err?.message || "Load payments summary failed");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [timeFilter]);

  const avgOrderValue = useMemo(() => {
    if (paidCountInRange <= 0) return 0;
    return Math.round(revenueInRange / paidCountInRange);
  }, [paidCountInRange, revenueInRange]);

  const commissionInRange = useMemo(
    () => Math.round(revenueInRange * PLATFORM_FEE_RATE),
    [revenueInRange],
  );

  const trendPct = useMemo(() => {
    if (!revenueData.length) return 0;
    const first = revenueData[0]?.revenue ?? 0;
    const last = revenueData[revenueData.length - 1]?.revenue ?? 0;
    if (first <= 0) return 0;
    return ((last - first) / first) * 100;
  }, [revenueData]);

  const trendBadge = useMemo(() => {
    const v = trendPct;
    const abs = Math.abs(v);
    if (abs < 0.01) return { text: "+0%", className: "bg-blue-500" };
    return v >= 0
      ? { text: `+${abs.toFixed(1)}%`, className: "bg-green-500" }
      : { text: `-${abs.toFixed(1)}%`, className: "bg-red-500" };
  }, [trendPct]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("paid") || s.includes("completed") || s.includes("complete") || s.includes("done")) {
      return <Badge className="bg-green-500">Đã thanh toán</Badge>;
    }
    if (s.includes("pending") || s.includes("confirmed")) {
      return <Badge className="bg-orange-500">Đang xử lý</Badge>;
    }
    if (s.includes("expired") || s.includes("fail") || s.includes("canceled")) {
      return <Badge className="bg-red-500">Không thành công</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getTableStatus = (b: BookingLike) => getStatusBadge(String(b.status ?? "unknown"));

  const iconMotion = {
    whileHover: { scale: 1.06, rotate: 2 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  return (
    <motion.div variants={pageFadeUp} initial="hidden" animate="visible" className="relative space-y-6">
      {/* Background spotlight-ish */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 z-0 h-72 w-[50%] -translate-x-1/2 rounded-full bg-linear-to-r from-green-500/20 to-blue-500/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Thanh Toán</h1>
          <p className="text-muted-foreground">Tổng doanh thu đã thanh toán & hoa hồng nền tảng</p>
          {error && <p className="text-sm text-red-600 mt-1">⚠ {error}</p>}
        </div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button className="bg-linear-to-r from-[#007BFF] to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </motion.div>
      </div>

      {/* Stats cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <Card className="border-0 shadow-lg bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  {...iconMotion}
                  className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <DollarSign className="w-7 h-7 text-white" />
                </motion.div>
                <Badge className={`${trendBadge.className}`}>{loading ? "..." : trendBadge.text}</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-1">Tổng doanh thu</p>
              <p className="text-3xl text-green-600">
                {loading ? (
                  <span className="inline-block w-[120px] h-9 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                ) : (
                  <AnimatedNumber value={revenueInRange} format={formatVnd} />
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.04 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <Card className="border-0 shadow-lg bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  {...iconMotion}
                  className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <TrendingUp className="w-7 h-7 text-white" />
                </motion.div>
                <Badge className="bg-blue-500">{loading ? "..." : "5%"}</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-1">Hoa hồng nền tảng</p>
              <p className="text-3xl text-blue-600">
                {loading ? (
                  <span className="inline-block w-[120px] h-9 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                ) : (
                  <AnimatedNumber value={commissionInRange} format={formatVnd} />
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <Card className="border-0 shadow-lg bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  {...iconMotion}
                  className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <CreditCard className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Giao dịch tháng này</p>
              <p className="text-3xl text-purple-600">
                {loading ? (
                  <span className="inline-block w-[90px] h-9 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                ) : (
                  <AnimatedNumber value={monthTransactions} format={(n) => String(n)} />
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <Card className="border-0 shadow-lg bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  {...iconMotion}
                  className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <DollarSign className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Giá trị TB/đơn</p>
              <p className="text-3xl text-orange-500">
                {loading ? (
                  <span className="inline-block w-[120px] h-9 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                ) : (
                  <AnimatedNumber value={avgOrderValue} format={formatVnd} />
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Biểu đồ doanh thu</CardTitle>
                  <CardDescription>
                    {timeFilter === "week"
                      ? "7 ngày gần nhất"
                      : timeFilter === "month"
                        ? "30 ngày gần nhất"
                        : "12 tháng gần nhất"}
                  </CardDescription>
                </div>

                <Select value={timeFilter} onValueChange={(v: string) => setTimeFilter(v as TimeFilter)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">7 ngày</SelectItem>
                    <SelectItem value="month">30 ngày</SelectItem>
                    <SelectItem value="year">12 tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-xl overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Doanh thu" />
                      <Line
                        type="monotone"
                        dataKey="commission"
                        stroke="#007BFF"
                        strokeWidth={3}
                        name="Hoa hồng (5%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Số lượng đơn hàng</CardTitle>
              <CardDescription>Theo doanh thu</CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8B5CF6" name="Đơn hàng" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payments table */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Lịch sử giao dịch</CardTitle>
            <CardDescription>Tất cả giao dịch thanh toán</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Mã GD</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Thợ</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Hoa hồng</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={idx} className="hover:bg-blue-50 transition-colors">
                      <TableCell>
                        <span className="inline-block w-[80px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[100px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[120px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[90px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[110px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[110px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[70px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-block w-[80px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block w-[120px] h-4 bg-gray-200/50 dark:bg-gray-800/50 animate-pulse rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-6">
                      Không có giao dịch đã thanh toán trong khoảng này.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentPayments.map((b, idx) => {
                    const amount = getBookingAmount(b);
                    const commission = Math.round(amount * PLATFORM_FEE_RATE);
                    const jobId = pickJobId(b);
                    const job = jobId ? jobById.get(jobId) : undefined;
                    const serviceName =
                      (job?.title as string) ?? (b.title as string) ?? b.jobId ?? b.bidId ?? "Dịch vụ";
                    const categoryName =
                      categoryNameById(categoriesList, job?.categoryId ?? b.categoryId) ||
                      (b.categoryName as string) ||
                      "N/A";
                    return (
                      <motion.tr
                        key={b.bookingId ?? `${b.jobId ?? "job"}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.04 }}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <TableCell className="font-medium text-[#007BFF]">
                          {b.bookingId ? shortCodeFromId(b.bookingId) : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[160px]">
                            <p className="font-medium">{serviceName}</p>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs bg-background/60 dark:bg-background/20"
                            >
                              {categoryName}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{b.customerId ? (userByName.get(b.customerId) ?? b.customerId) : "—"}</TableCell>
                        <TableCell>{b.workerId ? (workerByName.get(b.workerId) ?? b.workerId) : "—"}</TableCell>
                        <TableCell className="font-medium text-green-600">{formatVnd(amount)}</TableCell>
                        <TableCell className="font-medium text-blue-600">{formatVnd(commission)}</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell className="text-center">{getTableStatus(b)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{formatBookingDate(b)}</TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
