import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  ShoppingCart,
  Activity,
  ArrowUp,
  ArrowDown,
  Brain,
  Star,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useAdminTopCards } from "../../hooks/useAdminTopCards";
import { useAdminTotalRevenue, type RevenueTimeFilter } from "../../hooks/useAdminTotalRevenue";
import { adminApi, identityApi } from "../../services/api";
import { getAllWorkers, getWorkerReviews, WorkerProfile } from "../../services/workerService";

// ===== Mock data chỉ giữ cho AI box =====
const serviceData = [
  { name: "Điện", value: 35, color: "#FCD34D" },
  { name: "Nước", value: 25, color: "#3B82F6" },
  { name: "Máy lạnh", value: 20, color: "#06B6D4" },
  { name: "Máy giặt", value: 12, color: "#8B5CF6" },
  { name: "Khác", value: 8, color: "#10B981" },
];

const baseTrends = {
  users: [
    { name: "T2", value: 11820 },
    { name: "T3", value: 11910 },
    { name: "T4", value: 12040 },
    { name: "T5", value: 12160 },
    { name: "T6", value: 12210 },
    { name: "T7", value: 12340 },
    { name: "CN", value: 12480 },
  ],
  orders: [
    { name: "T2", value: 31120 },
    { name: "T3", value: 31510 },
    { name: "T4", value: 31840 },
    { name: "T5", value: 32210 },
    { name: "T6", value: 32590 },
    { name: "T7", value: 32780 },
    { name: "CN", value: 32910 },
  ],
};

type RatingDist = Record<1 | 2 | 3 | 4 | 5, number>;

type BookingLike = {
  bookingId?: string;
  id?: string;
  jobId?: string;
  customerId?: string;
  workerId?: string;
  finalAmount?: number | null;
  amount?: number | null;
  status?: string | null;
  scheduledDate?: string | null;
  scheduledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
};

type TopTechItem = {
  id: string;
  name: string;
  rating: number;
  jobs: number;
  revenue: number;
};

type RecentOrderItem = {
  id: string;
  customer: string;
  service: string;
  status: string;
  amount: number;
  time: string;
};

function formatNumber(n: number) {
  return (n || 0).toLocaleString("vi-VN");
}

function formatCurrency(n: number) {
  return `₫${formatNumber(Math.round(n || 0))}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shortDayLabelVi(d: Date) {
  const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return labels[d.getDay()] || "—";
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function monthLabel(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${m}/${String(d.getFullYear()).slice(-2)}`;
}

function scaleTrend(trend: { name: string; value: number }[], target: number) {
  const last = trend[trend.length - 1]?.value ?? 1;
  const ratio = last > 0 ? target / last : 1;
  if (!target) return trend;
  return trend.map((p) => ({ ...p, value: Math.round(p.value * ratio) }));
}

function extractArray<T = any>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function getReviewRating(r: any): number {
  const v = Number(r?.rating ?? r?.stars ?? r?.score ?? 0);
  return Number.isFinite(v) ? v : 0;
}

function getReviewCreatedAt(r: any): string | null {
  return r?.createdAt ?? r?.reviewDate ?? r?.updatedAt ?? null;
}

function safeTime(s?: string | null) {
  if (!s) return NaN;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : NaN;
}

function pickBookingTime(b: BookingLike): number {
  const candidates = [b.createdAt, b.completedAt, b.updatedAt, b.scheduledAt, b.scheduledDate];
  for (const c of candidates) {
    const t = safeTime(c);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

/** Thời điểm thanh toán (giống AdminPayments): ưu tiên updatedAt, completedAt, actualEndTime, ... */
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

function getBookingAmount(b: BookingLike) {
  const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;
  return Number.isFinite(v) ? v : 0;
}

/** Chỉ đơn đã thanh toán — status === "paid" (giống AdminPayments) */
function isPaidRevenueBooking(b: BookingLike): boolean {
  const s = String(b.status ?? "").trim().toLowerCase();
  return s === "paid";
}

function isCompletedBooking(b: BookingLike) {
  if (b.completedAt) return true;
  const s = String(b.status ?? "").toLowerCase();
  return (
    s.includes("paid") ||
    s.includes("complete") ||
    s.includes("completed") ||
    s.includes("done") ||
    s.includes("finish") ||
    s.includes("success")
  );
}

type ChartPoint = { name: string; revenue: number; orders: number };

function buildRevenueChartData(bookings: BookingLike[], filter: RevenueTimeFilter): ChartPoint[] {
  const today = startOfDay(new Date());
  const toMsExclusive = addDays(today, 1).getTime();

  if (filter === "year") {
    const points: ChartPoint[] = [];
    const bucket = new Map<string, { revenue: number; orders: number }>();
    for (let i = 0; i < 12; i++) {
      const d = startOfMonth(addMonths(today, -11 + i));
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      bucket.set(key, { revenue: 0, orders: 0 });
    }
    for (const b of bookings) {
      if (!isPaidRevenueBooking(b)) continue;
      const t = pickPaymentTime(b);
      if (!Number.isFinite(t) || t >= toMsExclusive) continue;
      const d = new Date(t);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const cell = bucket.get(key);
      if (!cell) continue;
      cell.revenue += getBookingAmount(b);
      cell.orders += 1;
    }
    for (let i = 0; i < 12; i++) {
      const d = startOfMonth(addMonths(today, -11 + i));
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const cell = bucket.get(key) ?? { revenue: 0, orders: 0 };
      points.push({ name: monthLabel(d), revenue: Math.round(cell.revenue / 1000), orders: cell.orders });
    }
    return points;
  }

  const days = filter === "week" ? 7 : 30;
  const rangeFrom = addDays(today, -(days - 1));
  const fromMs = rangeFrom.getTime();
  const bucket = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i < days; i++) {
    const d = addDays(rangeFrom, i);
    bucket.set(toYmd(d), { revenue: 0, orders: 0 });
  }
  for (const b of bookings) {
    if (!isPaidRevenueBooking(b)) continue;
    const t = pickPaymentTime(b);
    if (!Number.isFinite(t) || t < fromMs || t >= toMsExclusive) continue;
    const key = toYmd(startOfDay(new Date(t)));
    const cell = bucket.get(key);
    if (!cell) continue;
    cell.revenue += getBookingAmount(b);
    cell.orders += 1;
  }
  const points: ChartPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(rangeFrom, i);
    const cell = bucket.get(toYmd(d)) ?? { revenue: 0, orders: 0 };
    points.push({ name: shortDayLabelVi(d), revenue: Math.round(cell.revenue / 1000), orders: cell.orders });
  }
  return points;
}

function statusToLabel(status: string) {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "completed":
      return "Hoàn thành";
    case "in_progress":
      return "Đang làm";
    case "confirmed":
      return "Đã xác nhận";
    case "pending":
      return "Chờ xử lý";
    case "arrived":
      return "Đã đến nơi";
    case "paid":
      return "Đã thanh toán";
    case "payment_expired":
      return "Hết hạn thanh toán";
    default:
      return status || "Không rõ";
  }
}

function timeAgo(input?: string | null) {
  const t = safeTime(input);
  if (!Number.isFinite(t)) return "Không rõ thời gian";

  const diffMs = Date.now() - t;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
}

async function runWithLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let idx = 0;

  const runners = Array.from({ length: Math.max(1, limit) }, async () => {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await worker(items[current]);
    }
  });

  await Promise.all(runners);
  return results;
}

function badgeVariantByRecentStatus(status: string): "default" | "secondary" | "outline" {
  const s = String(status || "").toLowerCase();
  if (s === "completed") return "default";
  if (s === "in_progress" || s === "confirmed" || s === "paid") return "secondary";
  return "outline";
}

// Animation mũi tên % — cảm giác đang chuyển động (bounce nhẹ lặp lại)
const arrowUpMotion = {
  y: [0, -4, 0],
  transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const },
};
const arrowDownMotion = {
  y: [0, 4, 0],
  transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const },
};

export function AdminOverview() {
  const { totalUsers, totalOrders, loading, error, reload } = useDashboardStats();

  const {
    ordersToday,
    activeWorkers,
    newUsersToday,
    loading: topLoading,
    error: topError,
    reload: reloadTop,
  } = useAdminTopCards();

  const [timeFilter, setTimeFilter] = useState<RevenueTimeFilter>("week");

  const {
    totalRevenue,
    revenuePrev,
    loading: totalRevenueLoading,
    error: totalRevenueError,
    reload: reloadTotalRevenue,
  } = useAdminTotalRevenue(timeFilter);

  const [ratingDist, setRatingDist] = useState<RatingDist>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [ratingAvg, setRatingAvg] = useState<number>(0);
  const [ratingTotal, setRatingTotal] = useState<number>(0);
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);

  const [topTechnicians, setTopTechnicians] = useState<TopTechItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrderItem[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [allBookings, setAllBookings] = useState<BookingLike[]>([]);

  const revenueChartData = useMemo(
    () => buildRevenueChartData(allBookings, timeFilter),
    [allBookings, timeFilter],
  );

  const revenueChangePercent = revenuePrev > 0 ? ((totalRevenue - revenuePrev) / revenuePrev) * 100 : totalRevenue > 0 ? 100 : 0;
  const revenueTrend = revenueChangePercent >= 0 ? ("up" as const) : ("down" as const);
  const revenueChangeLabel = `${revenueChangePercent >= 0 ? "+" : ""}${revenueChangePercent.toFixed(1)}%`;

  const statsCards = [
    {
      title: "Tổng doanh thu",
      value: totalRevenueLoading ? "..." : `₫${(totalRevenue || 0).toLocaleString("vi-VN")}`,
      change: totalRevenueLoading ? "..." : revenueChangeLabel,
      trend: totalRevenueLoading ? ("up" as const) : revenueTrend,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Đơn hàng gần đây",
      value: String(ordersToday || 0),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Thợ hoạt động",
      value: String(activeWorkers || 0),
      change: "-2.4%",
      trend: "down" as const,
      icon: Wrench,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Người dùng mới",
      value: String(newUsersToday || 0),
      change: "+15.3%",
      trend: "up" as const,
      icon: Users,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const adminKpis = {
    totalUsers: totalUsers ?? 0,
    totalOrders: totalOrders ?? 0,
  };

  const kpiTrends = {
    users: scaleTrend(baseTrends.users, adminKpis.totalUsers),
    orders: scaleTrend(baseTrends.orders, adminKpis.totalOrders),
  };

  const loadRatingSummary = async () => {
    setRatingLoading(true);
    try {
      const workers: WorkerProfile[] = (await getAllWorkers(true)) || [];

      const dist: RatingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0;
      let total = 0;

      await runWithLimit(workers, 6, async (w) => {
        const data = await getWorkerReviews(w.workerId);
        const reviews = extractArray(data);

        for (const r of reviews) {
          const rating = getReviewRating(r);
          if (!rating) continue;

          const rounded = Math.max(1, Math.min(5, Math.round(rating))) as 1 | 2 | 3 | 4 | 5;
          dist[rounded] += 1;
          sum += rating;
          total += 1;
        }

        return true;
      });

      setRatingDist(dist);
      setRatingTotal(total);
      setRatingAvg(total > 0 ? sum / total : 0);
    } catch (e) {
      console.error("loadRatingSummary error:", e);
      setRatingDist({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      setRatingTotal(0);
      setRatingAvg(0);
    } finally {
      setRatingLoading(false);
    }
  };

  const loadTopTechniciansAndRecentOrders = async () => {
    setListLoading(true);
    try {
      const [workersRes, bookingsRes, usersRes] = await Promise.all([
        getAllWorkers(true),
        adminApi.getAdminBookings(),
        identityApi.getUsers(),
      ]);

      const workers: WorkerProfile[] = workersRes || [];
      const bookings: BookingLike[] = extractArray<BookingLike>(bookingsRes);
      const users = extractArray<any>(usersRes);

      setAllBookings(bookings);
      const userMap = new Map<string, any>(users.map((u) => [u.userId, u]));

      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      // ===== TOP THỢ XUẤT SẮC =====
      const techStats = await runWithLimit(workers, 6, async (worker) => {
        let reviews: any[] = [];
        try {
          const reviewRes = await getWorkerReviews(worker.workerId);
          reviews = extractArray(reviewRes);
        } catch {
          reviews = [];
        }

        const validReviews = reviews.filter((r) => getReviewRating(r) > 0);
        const reviewCount = validReviews.length;
        const avgRating =
          reviewCount > 0 ? validReviews.reduce((sum, r) => sum + getReviewRating(r), 0) / reviewCount : 0;

        const workerCompletedBookings = bookings.filter((b) => b.workerId === worker.workerId && isCompletedBooking(b));

        const revenue = workerCompletedBookings.reduce((sum, b) => sum + getBookingAmount(b), 0);

        // nếu muốn "tháng này" thì lọc review theo 30 ngày gần nhất
        const reviewsThisMonth = validReviews.filter((r) => {
          const t = safeTime(getReviewCreatedAt(r));
          if (!Number.isFinite(t)) return true;
          return t >= Date.now() - 30 * 24 * 60 * 60 * 1000;
        });

        const avgThisMonth =
          reviewsThisMonth.length > 0
            ? reviewsThisMonth.reduce((sum, r) => sum + getReviewRating(r), 0) / reviewsThisMonth.length
            : avgRating;

        return {
          id: worker.workerId,
          name: worker.fullName || worker.phone || "Chưa cập nhật",
          rating: avgThisMonth,
          jobs: worker.completedJobs || workerCompletedBookings.length,
          revenue,
          reviewCount,
        };
      });

      const ranked = techStats
        .filter((t) => t.reviewCount > 0 || t.jobs > 0)
        .sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
          if (b.jobs !== a.jobs) return b.jobs - a.jobs;
          return b.revenue - a.revenue;
        })
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          name: t.name,
          rating: t.rating,
          jobs: t.jobs,
          revenue: t.revenue,
        }));

      setTopTechnicians(ranked);

      // ===== ĐƠN HÀNG GẦN ĐÂY 7 NGÀY =====
      const recent = bookings
        .filter((b) => {
          const t = pickBookingTime(b);
          return Number.isFinite(t) && t >= sevenDaysAgo;
        })
        .sort((a, b) => pickBookingTime(b) - pickBookingTime(a))
        .slice(0, 4)
        .map((b) => {
          const customer = userMap.get(b.customerId || "");
          const customerName = customer?.fullName || customer?.name || customer?.phone || "Khách hàng";

          return {
            id: `#${String(b.bookingId || b.id || "").slice(0, 4) || "----"}`,
            customer: customerName,
            service: b.jobId ? `Job ${String(b.jobId).slice(0, 6)}` : "Đơn dịch vụ",
            status: statusToLabel(String(b.status || "")),
            amount: getBookingAmount(b),
            time: timeAgo(b.createdAt || b.scheduledDate || b.updatedAt),
          };
        });

      setRecentOrders(recent);
    } catch (e) {
      console.error("loadTopTechniciansAndRecentOrders error:", e);
      setTopTechnicians([]);
      setRecentOrders([]);
      setAllBookings([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadRatingSummary();
    loadTopTechniciansAndRecentOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxStarCount = useMemo(() => {
    return Math.max(ratingDist[1], ratingDist[2], ratingDist[3], ratingDist[4], ratingDist[5], 1);
  }, [ratingDist]);

  const isRefreshing = loading || topLoading || ratingLoading || listLoading || totalRevenueLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl mb-2">Dashboard Tổng Quan</h1>
          <p className="text-muted-foreground">Xin chào Admin, đây là tổng quan hệ thống hôm nay</p>
        </div>

        <motion.button
          onClick={() => {
            reload();
            reloadTop();
            reloadTotalRevenue();
            loadRatingSummary();
            loadTopTechniciansAndRecentOrders();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          title="Tải lại"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      {isRefreshing && <p className="text-sm text-gray-500">Đang tải dữ liệu dashboard...</p>}

      {error && (
        <div className="text-sm text-red-600">
          Lỗi (Stats): {error}{" "}
          <button className="underline" onClick={reload}>
            Thử lại
          </button>
        </div>
      )}

      {topError && (
        <div className="text-sm text-red-600">
          Lỗi (Top Cards): {topError}{" "}
          <button className="underline" onClick={reloadTop}>
            Thử lại
          </button>
        </div>
      )}

      {totalRevenueError && (
        <div className="text-sm text-red-600">
          Lỗi (Tổng doanh thu): {totalRevenueError}{" "}
          <button className="underline" onClick={reloadTotalRevenue}>
            Thử lại
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-default"
            >
              <Card className="bg-background/60 backdrop-blur-xl border-border/40 shadow-xl hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge
                      variant={stat.trend === "up" ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {stat.trend === "up" ? (
                        <motion.span animate={arrowUpMotion} className="inline-flex">
                          <ArrowUp className="w-3 h-3" />
                        </motion.span>
                      ) : (
                        <motion.span animate={arrowDownMotion} className="inline-flex">
                          <ArrowDown className="w-3 h-3" />
                        </motion.span>
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    {stat.title}
                    {stat.title === "Tổng doanh thu" && (
                      <span className="ml-1 text-muted-foreground/80">
                        ({timeFilter === "week" ? "7 ngày" : timeFilter === "month" ? "30 ngày" : "12 tháng"})
                      </span>
                    )}
                  </p>
                  {stat.value === "..." ? (
                    <Skeleton className="h-8 w-40 rounded-lg" />
                  ) : (
                    <p className="text-2xl">{stat.value}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl border-border/40 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Tổng số người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-3xl">{formatNumber(adminKpis.totalUsers)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary">Total</Badge>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                  <ArrowUp className="w-3 h-3" />
                  +3.1%
                </span>
              </div>
            </div>

            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiTrends.users} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    fill="url(#usersFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.09 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl border-border/40 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              Tổng đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-3xl">{formatNumber(adminKpis.totalOrders)}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary">Total</Badge>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                  <ArrowUp className="w-3 h-3" />
                  +6.7%
                </span>
              </div>
            </div>

            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiTrends.orders} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-3)"
                    strokeWidth={2.5}
                    fill="url(#ordersFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl border-border/40 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl">{ratingAvg.toFixed(2)}</p>
                  <span className="text-gray-500">/ 5</span>
                </div>
                <p className="text-xs text-gray-500">Tổng {formatNumber(ratingTotal)} đánh giá</p>
              </div>
              <Badge className="flex items-center gap-1" variant="secondary">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                Avg
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDist[star as 1 | 2 | 3 | 4 | 5];
                const p = Math.round((count / maxStarCount) * 100);
                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="w-10 text-xs text-muted-foreground">{star}★</div>
                    <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${p}%` }} />
                    </div>
                    <div className="w-14 text-right text-xs text-muted-foreground">{formatNumber(count)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl border-border/40 transition-colors hover:border-primary/30">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Biểu đồ doanh thu
                </CardTitle>
                <CardDescription>
                  {timeFilter === "week"
                    ? "7 ngày gần nhất"
                    : timeFilter === "month"
                      ? "30 ngày gần nhất"
                      : "12 tháng gần nhất"}
                  {" · Theo dõi doanh thu và số đơn hàng"}
                </CardDescription>
              </div>
              <Select value={timeFilter} onValueChange={(v: string) => setTimeFilter(v as RevenueTimeFilter)}>
                <SelectTrigger className="w-[130px]">
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-2)"
                  strokeWidth={3}
                  name="Doanh thu (k)"
                />
                <Line type="monotone" dataKey="orders" stroke="var(--chart-3)" strokeWidth={3} name="Đơn hàng" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.09 }}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl border-border/40 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Phân bố dịch vụ
            </CardTitle>
            <CardDescription>Loại dịch vụ được yêu cầu nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Thợ Xuất Sắc
            </CardTitle>
            <CardDescription>Được đánh giá cao nhất tháng này</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTechnicians.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có dữ liệu thợ.</p>
              ) : (
                topTechnicians.map((tech, index) => (
                  <div
                    key={tech.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          index === 0
                            ? "bg-linear-to-br from-yellow-400 to-orange-500"
                            : index === 1
                              ? "bg-linear-to-br from-gray-400 to-gray-500"
                              : index === 2
                                ? "bg-linear-to-br from-orange-600 to-orange-700"
                                : "bg-linear-to-br from-blue-500 to-purple-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-blue-600 transition-colors">{tech.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{tech.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{tech.jobs} việc</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">{formatCurrency(tech.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Đơn Hàng Gần Đây
            </CardTitle>
            <CardDescription>Cập nhật thời gian thực</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500">Không có đơn hàng trong 7 ngày gần đây.</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-blue-600">{order.id}</p>
                        <Badge variant={badgeVariantByRecentStatus(order.status)} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer} - {order.service}
                      </p>
                      <p className="text-xs text-gray-400">{order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(order.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0 bg-linear-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Hoạt Động AI Hôm Nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <p className="text-muted-foreground text-sm mb-1">Tư vấn AI</p>
              <p className="text-2xl text-purple-600">234</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-muted-foreground text-sm mb-1">Phân tích lỗi</p>
              <p className="text-2xl text-blue-600">189</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-muted-foreground text-sm mb-1">Gợi ý thợ</p>
              <p className="text-2xl text-green-600">342</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-muted-foreground text-sm mb-1">Độ chính xác</p>
              <p className="text-2xl text-orange-600">94.5%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
