import { useState } from "react";
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

const revenueData = [
  { date: "20/10", revenue: 12500000, commission: 1875000, orders: 45 },
  { date: "21/10", revenue: 15200000, commission: 2280000, orders: 52 },
  { date: "22/10", revenue: 13800000, commission: 2070000, orders: 48 },
  { date: "23/10", revenue: 18500000, commission: 2775000, orders: 61 },
  { date: "24/10", revenue: 16900000, commission: 2535000, orders: 57 },
  { date: "25/10", revenue: 21300000, commission: 3195000, orders: 68 },
  { date: "26/10", revenue: 19800000, commission: 2970000, orders: 64 },
];

const transactions = [
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
    technician: null,
    amount: 200000,
    commission: 0,
    method: "Tiền mặt",
    status: "refunded",
    date: "28/10/2025 16:30",
  },
];

export function AdminPayments() {
  const [timeFilter, setTimeFilter] = useState("week");

  const totalRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);

  const totalCommission = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.commission, 0);

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
              <Badge className="bg-green-500">+12.5%</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Tổng doanh thu</p>
            <p className="text-3xl text-green-600">₫{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-blue-500">+8.3%</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Hoa hồng nền tảng</p>
            <p className="text-3xl text-blue-600">₫{totalCommission.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Giao dịch hôm nay</p>
            <p className="text-3xl text-purple-600">{transactions.length}</p>
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
            <p className="text-3xl text-orange-600">
              ₫{Math.round(totalRevenue / transactions.filter((t) => t.status === "completed").length).toLocaleString()}
            </p>
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
                <CardDescription>7 ngày gần nhất</CardDescription>
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
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
                <Line type="monotone" dataKey="commission" stroke="#007BFF" strokeWidth={3} name="Hoa hồng" />
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

      {/* Payment Methods Distribution */}
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

      {/* Transactions Table */}
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
                  <TableCell className="font-medium text-green-600">₫{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-blue-600">
                    ₫{transaction.commission.toLocaleString()}
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
