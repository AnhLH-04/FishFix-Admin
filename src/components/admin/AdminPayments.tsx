import { useEffect, useMemo, useState } from "react";
import { DollarSign, TrendingUp, CreditCard, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ dùng adminApi có sẵn của bạn
import { adminApi } from "../../services/api";

type TimeFilter = "week" | "month" | "year";

type BookingLike = {
  bookingId?: string;
  id?: string;

  status?: any; // string/number tuỳ backend
  amount?: number;
  finalAmount?: number;

  scheduledDate?: string;
  scheduledAt?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;

  // vẫn giữ để không lỗi type nếu backend trả
  serviceFeePercent?: number;
  platformFeeAmount?: number;
};

type RevenuePoint = {
  date: string;
  revenue: number;
  commission: number; // ✅ = revenue * 5%
  orders: number;
};

// ====== MOCK payments table (vì chưa có endpoint list payments admin) ======
const mockTransactions = [
  {
    id: "PAY-1245",
    orderId: "#1245",
    customer: "Nguyễn Văn A",
    technician: "Trần Minh B",
    amount: 350000,
    commission: 52500,
    method: "Tiền mặt",
    status: "completed",
    date: "29/10/2025 13:00",
  },
  {
    id: "PAY-1244",
    orderId: "#1244",
    customer: "Trần Thị B",
    technician: "Nguyễn Văn A",
    amount: 500000,
    commission: 75000,
    method: "Chuyển khoản",
    status: "completed",
    date: "29/10/2025 11:30",
  },
  {
    id: "PAY-1243",
    orderId: "#1243",
    customer: "Lê Minh C",
    technician: "Lê Hoàng C",
    amount: 280000,
    commission: 42000,
    method: "Ví điện tử",
    status: "processing",
    date: "29/10/2025 10:15",
  },
  {
    id: "PAY-1242",
    orderId: "#1242",
    customer: "Phạm Hoàng D",
    technician: "Nguyễn Văn A",
    amount: 420000,
    commission: 63000,
    method: "Thẻ tín dụng",
    status: "completed",
    date: "29/10/2025 09:45",
  },
  {
    id: "PAY-1241",
    orderId: "#1241",
    customer: "Vũ Thu E",
    technician: null as any,
    amount: 200000,
    commission: 0,
    method: "Tiền mặt",
    status: "refunded",
    date: "28/10/2025 16:30",
  },
];

// ====== helpers ======
function asArray(payload: any): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.result)) return payload.result;
  return [];
}

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

function safeTime(s?: string) {
  if (!s) return NaN;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : NaN;
}

function pickBookingTime(b: BookingLike): number {
  // ưu tiên scheduledDate/scheduledAt nếu có; fallback createdAt
  const candidates = [b.scheduledDate, b.scheduledAt, b.completedAt, b.createdAt, b.updatedAt];
  for (const c of candidates) {
    const t = safeTime(c);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

function isCompletedBooking(b: BookingLike) {
  if (b.completedAt) return true;

  const st = b.status;
  if (typeof st === "string") {
    const s = st.toLowerCase();
    return (
      s.includes("complete") ||
      s.includes("completed") ||
      s.includes("done") ||
      s.includes("finish") ||
      s.includes("success")
    );
  }
  // nếu backend dùng số enum thì đoán: >=3 thường là completed
  if (typeof st === "number") return st >= 3;
  return false;
}

function getBookingAmount(b: BookingLike) {
  const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;
  return Number.isFinite(v) ? v : 0;
}

const PLATFORM_FEE_RATE = 0.05; // ✅ 5%

export function AdminPayments() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);

  // ✅ NEW: giao dịch theo tháng (đếm booking completed trong tháng hiện tại)
  const [monthTransactions, setMonthTransactions] = useState<number>(0);

  // Bảng vẫn mock (chưa có endpoint list payments admin)
  const transactions = useMemo(() => mockTransactions, []);

  // ✅ avg theo doanh thu thật + số đơn completed thật theo timeFilter
  const [completedCountRange, setCompletedCountRange] = useState<number>(0);

  const avgOrderValue = useMemo(() => {
    if (completedCountRange <= 0) return 0;
    return Math.round(totalRevenue / completedCountRange);
  }, [totalRevenue, completedCountRange]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = startOfDay(new Date());

        // range cho chart/tổng doanh thu theo filter
        const rangeFrom =
          timeFilter === "week"
            ? addDays(today, -6)
            : timeFilter === "month"
              ? addDays(today, -29)
              : addDays(today, -364);

        // range cho "giao dịch tháng này"
        const monthFrom = startOfMonth(today);

        // fetch 1 lần với from sớm nhất để đủ dữ liệu cho cả 2
        const minFrom = rangeFrom.getTime() < monthFrom.getTime() ? rangeFrom : monthFrom;

        const scheduledFrom = toYmd(minFrom);
        const scheduledTo = toYmd(today);

        // 1) thử gọi có filter ngày
        let raw: any;
        try {
          raw = await adminApi.getAdminBookings({ scheduledFrom, scheduledTo });
        } catch {
          raw = null;
        }

        let bookings: BookingLike[] = asArray(raw);

        // 2) nếu rỗng -> fallback gọi không filter, rồi lọc client
        if (!bookings || bookings.length === 0) {
          const rawAll = await adminApi.getAdminBookings();
          bookings = asArray(rawAll);
        }

        // ----- lọc completed -----
        const toMsInclusive = addDays(today, 1).getTime();

        const inRange = (b: BookingLike, from: Date, toMs: number) => {
          const t = pickBookingTime(b);
          return Number.isFinite(t) && t >= from.getTime() && t < toMs;
        };

        const completedAll = bookings.filter((b) => isCompletedBooking(b));

        const completedRange = completedAll.filter((b) => inRange(b, rangeFrom, toMsInclusive));
        const completedThisMonth = completedAll.filter((b) => inRange(b, monthFrom, toMsInclusive));

        // ✅ giao dịch tháng này = số booking completed trong tháng
        setMonthTransactions(completedThisMonth.length);

        // ✅ tổng đơn completed theo range để tính TB/đơn
        setCompletedCountRange(completedRange.length);

        // ✅ doanh thu theo range
        const revenue = completedRange.reduce((sum, b) => sum + getBookingAmount(b), 0);
        const safeRevenue = Number.isFinite(revenue) ? revenue : 0;
        setTotalRevenue(safeRevenue);

        // ✅ hoa hồng = 5% tổng doanh thu
        const commission = Math.round(safeRevenue * PLATFORM_FEE_RATE);
        setTotalCommission(Number.isFinite(commission) ? commission : 0);

        // ----- build chart -----
        const points: RevenuePoint[] = [];

        if (timeFilter === "year") {
          // 12 tháng gần nhất
          const map = new Map<string, { d: Date; revenue: number; orders: number }>();
          for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            map.set(key, { d, revenue: 0, orders: 0 });
          }

          for (const b of completedRange) {
            const t = pickBookingTime(b);
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

          for (const b of completedRange) {
            const t = pickBookingTime(b);
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
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Load payments summary failed");
        setTotalRevenue(0);
        setTotalCommission(0);
        setRevenueData([]);
        setMonthTransactions(0);
        setCompletedCountRange(0);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [timeFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Thành công</Badge>;
      case "processing":
        return <Badge className="bg-orange-500">Đang xử lý</Badge>;
      case "refunded":
        return <Badge className="bg-blue-500">Đã hoàn tiền</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      "Tiền mặt": "bg-gray-600",
      "Chuyển khoản": "bg-blue-600",
      "Ví điện tử": "bg-purple-600",
      "Thẻ tín dụng": "bg-pink-600",
    };
    return <Badge className={colors[method] || "bg-gray-600"}>{method}</Badge>;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Thanh Toán</h1>
          <p className="text-gray-600">Theo dõi doanh thu và giao dịch</p>
          {error && <p className="text-sm text-red-600 mt-1">⚠ {error}</p>}
        </div>
        <Button className="bg-gradient-to-r from-[#007BFF] to-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-green-500">{loading ? "..." : "+12.5%"}</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Tổng doanh thu</p>
            <p className="text-3xl text-green-600">₫{totalRevenue.toLocaleString("vi-VN")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-blue-500">{loading ? "..." : "+8.3%"}</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Hoa hồng nền tảng</p>
            <p className="text-3xl text-blue-600">₫{totalCommission.toLocaleString("vi-VN")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Giao dịch tháng này</p>
            <p className="text-3xl text-purple-600">{loading ? "..." : monthTransactions}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Giá trị TB/đơn</p>
            <p className="text-3xl text-orange-600">₫{avgOrderValue.toLocaleString("vi-VN")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
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
              <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Doanh thu" />
                <Line type="monotone" dataKey="commission" stroke="#007BFF" strokeWidth={3} name="Hoa hồng (5%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Số lượng đơn hàng</CardTitle>
            <CardDescription>Theo doanh thu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8B5CF6" name="Đơn hàng" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Distribution (mock) */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Phân bổ phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tiền mặt</p>
              <p className="text-2xl">
                {transactions.filter((t) => t.method === "Tiền mặt" && t.status === "completed").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Giao dịch</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Chuyển khoản</p>
              <p className="text-2xl text-blue-600">
                {transactions.filter((t) => t.method === "Chuyển khoản" && t.status === "completed").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Giao dịch</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ví điện tử</p>
              <p className="text-2xl text-purple-600">
                {transactions.filter((t) => t.method === "Ví điện tử" && t.status === "completed").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Giao dịch</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Thẻ tín dụng</p>
              <p className="text-2xl text-pink-600">
                {transactions.filter((t) => t.method === "Thẻ tín dụng" && t.status === "completed").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Giao dịch</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table (mock) */}
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
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-blue-50 transition-colors">
                  <TableCell className="font-medium text-[#007BFF]">{transaction.id}</TableCell>
                  <TableCell className="font-medium">{transaction.orderId}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.technician || <span className="text-gray-400">-</span>}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    ₫{transaction.amount.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    ₫{transaction.commission.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>{getMethodBadge(transaction.method)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
