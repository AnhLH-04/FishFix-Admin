// import {
//   TrendingUp,
//   Users,
//   Wrench,
//   DollarSign,
//   ShoppingCart,
//   Activity,
//   ArrowUp,
//   ArrowDown,
//   Brain,
//   Star,
//   Clock
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
// import { Badge } from '../ui/badge';
// import { Avatar } from '../ui/avatar';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';

// const statsCards = [
//   {
//     title: 'Tổng doanh thu',
//     value: '₫45,231,000',
//     change: '+12.5%',
//     trend: 'up',
//     icon: DollarSign,
//     color: 'from-green-500 to-emerald-600',
//   },
//   {
//     title: 'Đơn hàng hôm nay',
//     value: '156',
//     change: '+8.2%',
//     trend: 'up',
//     icon: ShoppingCart,
//     color: 'from-blue-500 to-blue-600',
//   },
//   {
//     title: 'Thợ hoạt động',
//     value: '342',
//     change: '-2.4%',
//     trend: 'down',
//     icon: Wrench,
//     color: 'from-purple-500 to-purple-600',
//   },
//   {
//     title: 'Người dùng mới',
//     value: '89',
//     change: '+15.3%',
//     trend: 'up',
//     icon: Users,
//     color: 'from-orange-500 to-orange-600',
//   },
// ];

// const revenueData = [
//   { name: 'T2', revenue: 4200, orders: 24 },
//   { name: 'T3', revenue: 5100, orders: 32 },
//   { name: 'T4', revenue: 4800, orders: 28 },
//   { name: 'T5', revenue: 6300, orders: 38 },
//   { name: 'T6', revenue: 7200, orders: 42 },
//   { name: 'T7', revenue: 8100, orders: 48 },
//   { name: 'CN', revenue: 5900, orders: 35 },
// ];

// const serviceData = [
//   { name: 'Điện', value: 35, color: '#FCD34D' },
//   { name: 'Nước', value: 25, color: '#3B82F6' },
//   { name: 'Máy lạnh', value: 20, color: '#06B6D4' },
//   { name: 'Máy giặt', value: 12, color: '#8B5CF6' },
//   { name: 'Khác', value: 8, color: '#10B981' },
// ];

// const topTechnicians = [
//   { id: 1, name: 'Nguyễn Văn A', rating: 4.9, jobs: 234, revenue: '₫15,200,000' },
//   { id: 2, name: 'Trần Minh B', rating: 4.8, jobs: 189, revenue: '₫12,800,000' },
//   { id: 3, name: 'Lê Hoàng C', rating: 5.0, jobs: 156, revenue: '₫11,500,000' },
//   { id: 4, name: 'Phạm Thị D', rating: 4.7, jobs: 142, revenue: '₫9,800,000' },
//   { id: 5, name: 'Vũ Minh E', rating: 4.9, jobs: 138, revenue: '₫9,200,000' },
// ];

// const recentOrders = [
//   { id: '#1245', customer: 'Nguyễn A', service: 'Sửa điện', status: 'Đang làm', amount: '₫350,000', time: '10 phút trước' },
//   { id: '#1244', customer: 'Trần B', service: 'Máy lạnh', status: 'Hoàn thành', amount: '₫500,000', time: '25 phút trước' },
//   { id: '#1243', customer: 'Lê C', service: 'Sửa nước', status: 'Đang tìm thợ', amount: '₫280,000', time: '35 phút trước' },
//   { id: '#1242', customer: 'Phạm D', service: 'Máy giặt', status: 'Hoàn thành', amount: '₫420,000', time: '1 giờ trước' },
// ];

// export function AdminOverview() {
//   return (
//     <div className="space-y-6 animate-slide-up">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl mb-2">Dashboard Tổng Quan</h1>
//         <p className="text-gray-600">Xin chào Admin, đây là tổng quan hệ thống hôm nay</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsCards.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <Card
//               key={stat.title}
//               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
//                     <Icon className="w-7 h-7 text-white" />
//                   </div>
//                   <Badge
//                     variant={stat.trend === 'up' ? 'default' : 'destructive'}
//                     className="flex items-center gap-1"
//                   >
//                     {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
//                     {stat.change}
//                   </Badge>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
//                 <p className="text-2xl">{stat.value}</p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Chart */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-[#007BFF]" />
//               Doanh thu 7 ngày
//             </CardTitle>
//             <CardDescription>Theo dõi doanh thu và số đơn hàng</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#007BFF"
//                   strokeWidth={3}
//                   name="Doanh thu (k)"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#8B5CF6"
//                   strokeWidth={3}
//                   name="Đơn hàng"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Service Distribution */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Activity className="w-5 h-5 text-[#007BFF]" />
//               Phân bố dịch vụ
//             </CardTitle>
//             <CardDescription>Loại dịch vụ được yêu cầu nhiều nhất</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={serviceData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {serviceData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tables Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Technicians */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Star className="w-5 h-5 text-yellow-500" />
//               Top Thợ Xuất Sắc
//             </CardTitle>
//             <CardDescription>Được đánh giá cao nhất tháng này</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {topTechnicians.map((tech, index) => (
//                 <div
//                   key={tech.id}
//                   className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
//                 >
//                   <div className="relative">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
//                       index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
//                       index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
//                       index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
//                       'bg-gradient-to-br from-blue-500 to-purple-600'
//                     }`}>
//                       {index + 1}
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium group-hover:text-[#007BFF] transition-colors">{tech.name}</p>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                       <span>{tech.rating}</span>
//                       <span>•</span>
//                       <span>{tech.jobs} việc</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-green-600">{tech.revenue}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Orders */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="w-5 h-5 text-[#007BFF]" />
//               Đơn Hàng Gần Đây
//             </CardTitle>
//             <CardDescription>Cập nhật thời gian thực</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentOrders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <p className="font-medium text-[#007BFF]">{order.id}</p>
//                       <Badge
//                         variant={
//                           order.status === 'Hoàn thành' ? 'default' :
//                           order.status === 'Đang làm' ? 'secondary' :
//                           'outline'
//                         }
//                         className="text-xs"
//                       >
//                         {order.status}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600">{order.customer} - {order.service}</p>
//                     <p className="text-xs text-gray-400">{order.time}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium text-green-600">{order.amount}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* AI Activity */}
//       <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Brain className="w-5 h-5 text-purple-600" />
//             Hoạt Động AI Hôm Nay
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Tư vấn AI</p>
//               <p className="text-2xl text-purple-600">234</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Phân tích lỗi</p>
//               <p className="text-2xl text-blue-600">189</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Gợi ý thợ</p>
//               <p className="text-2xl text-green-600">342</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Độ chính xác</p>
//               <p className="text-2xl text-orange-600">94.5%</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// import {
//   TrendingUp,
//   Users,
//   Wrench,
//   DollarSign,
//   ShoppingCart,
//   Activity,
//   ArrowUp,
//   ArrowDown,
//   Brain,
//   Star,
//   Clock,
//   RefreshCw,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
// import { Badge } from "../ui/badge";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // ✅ chỉnh path này cho đúng nơi bạn đặt hook
// import { useDashboardStats } from "../../hooks/useDashboardStats";
// import { useAdminTopCards } from "../../hooks/useAdminTopCards";

// const statsCards = [
//   {
//     title: "Tổng doanh thu",
//     value: "₫45,231,000",
//     change: "+12.5%",
//     trend: "up",
//     icon: DollarSign,
//     color: "from-green-500 to-emerald-600",
//   },
//   {
//     title: "Đơn hàng hôm nay",
//     value: "156",
//     change: "+8.2%",
//     trend: "up",
//     icon: ShoppingCart,
//     color: "from-blue-500 to-blue-600",
//   },
//   {
//     title: "Thợ hoạt động",
//     value: "342",
//     change: "-2.4%",
//     trend: "down",
//     icon: Wrench,
//     color: "from-purple-500 to-purple-600",
//   },
//   {
//     title: "Người dùng mới",
//     value: "89",
//     change: "+15.3%",
//     trend: "up",
//     icon: Users,
//     color: "from-orange-500 to-orange-600",
//   },
// ];

// const revenueData = [
//   { name: "T2", revenue: 4200, orders: 24 },
//   { name: "T3", revenue: 5100, orders: 32 },
//   { name: "T4", revenue: 4800, orders: 28 },
//   { name: "T5", revenue: 6300, orders: 38 },
//   { name: "T6", revenue: 7200, orders: 42 },
//   { name: "T7", revenue: 8100, orders: 48 },
//   { name: "CN", revenue: 5900, orders: 35 },
// ];

// const serviceData = [
//   { name: "Điện", value: 35, color: "#FCD34D" },
//   { name: "Nước", value: 25, color: "#3B82F6" },
//   { name: "Máy lạnh", value: 20, color: "#06B6D4" },
//   { name: "Máy giặt", value: 12, color: "#8B5CF6" },
//   { name: "Khác", value: 8, color: "#10B981" },
// ];

// const topTechnicians = [
//   { id: 1, name: "Nguyễn Văn A", rating: 4.9, jobs: 234, revenue: "₫15,200,000" },
//   { id: 2, name: "Trần Minh B", rating: 4.8, jobs: 189, revenue: "₫12,800,000" },
//   { id: 3, name: "Lê Hoàng C", rating: 5.0, jobs: 156, revenue: "₫11,500,000" },
//   { id: 4, name: "Phạm Thị D", rating: 4.7, jobs: 142, revenue: "₫9,800,000" },
//   { id: 5, name: "Vũ Minh E", rating: 4.9, jobs: 138, revenue: "₫9,200,000" },
// ];

// const recentOrders = [
//   {
//     id: "#1245",
//     customer: "Nguyễn A",
//     service: "Sửa điện",
//     status: "Đang làm",
//     amount: "₫350,000",
//     time: "10 phút trước",
//   },
//   {
//     id: "#1244",
//     customer: "Trần B",
//     service: "Máy lạnh",
//     status: "Hoàn thành",
//     amount: "₫500,000",
//     time: "25 phút trước",
//   },
//   {
//     id: "#1243",
//     customer: "Lê C",
//     service: "Sửa nước",
//     status: "Đang tìm thợ",
//     amount: "₫280,000",
//     time: "35 phút trước",
//   },
//   {
//     id: "#1242",
//     customer: "Phạm D",
//     service: "Máy giặt",
//     status: "Hoàn thành",
//     amount: "₫420,000",
//     time: "1 giờ trước",
//   },
// ];

// // Base trend mock (sẽ scale theo số API để khớp)
// const baseTrends = {
//   users: [
//     { name: "T2", value: 11820 },
//     { name: "T3", value: 11910 },
//     { name: "T4", value: 12040 },
//     { name: "T5", value: 12160 },
//     { name: "T6", value: 12210 },
//     { name: "T7", value: 12340 },
//     { name: "CN", value: 12480 },
//   ],
//   orders: [
//     { name: "T2", value: 31120 },
//     { name: "T3", value: 31510 },
//     { name: "T4", value: 31840 },
//     { name: "T5", value: 32210 },
//     { name: "T6", value: 32590 },
//     { name: "T7", value: 32780 },
//     { name: "CN", value: 32910 },
//   ],
// };

// function formatNumber(n: number) {
//   return (n || 0).toLocaleString("vi-VN");
// }

// function calcRatingSummary(ratings: Record<1 | 2 | 3 | 4 | 5, number>) {
//   const total = ratings[1] + ratings[2] + ratings[3] + ratings[4] + ratings[5];
//   const weighted = ratings[1] * 1 + ratings[2] * 2 + ratings[3] * 3 + ratings[4] * 4 + ratings[5] * 5;
//   const avg = total === 0 ? 0 : weighted / total;
//   return { total, avg };
// }

// function scaleTrend(trend: { name: string; value: number }[], target: number) {
//   const last = trend[trend.length - 1]?.value ?? 1;
//   const ratio = last > 0 ? target / last : 1;
//   // nếu target = 0 thì giữ trend gốc để không bị all 0
//   if (!target) return trend;
//   return trend.map((p) => ({ ...p, value: Math.round(p.value * ratio) }));
// }

// export function AdminOverview() {
//   // ✅ lấy số liệu thật từ API (bước 1 & 2 bạn đã làm trong hook)
//   const { totalUsers, totalOrders, ratings, loading, error, reload } = useDashboardStats();

//   // ✅ dùng số thật cho KPIs
//   const adminKpis = {
//     totalUsers: totalUsers ?? 0,
//     totalOrders: totalOrders ?? 0,
//     // nếu hook chưa trả ratings thì fallback về mock để không crash
//     ratings:
//       (ratings as Record<1 | 2 | 3 | 4 | 5, number>) ||
//       ({ 5: 5231, 4: 2478, 3: 641, 2: 187, 1: 105 } as Record<1 | 2 | 3 | 4 | 5, number>),
//   };

//   // ✅ scale sparkline theo số thật để nhìn khớp
//   const kpiTrends = {
//     users: scaleTrend(baseTrends.users, adminKpis.totalUsers),
//     orders: scaleTrend(baseTrends.orders, adminKpis.totalOrders),
//   };

//   const { total: totalReviews, avg: avgRating } = calcRatingSummary(adminKpis.ratings);

//   const maxStarCount = Math.max(
//     adminKpis.ratings[1],
//     adminKpis.ratings[2],
//     adminKpis.ratings[3],
//     adminKpis.ratings[4],
//     adminKpis.ratings[5],
//     1,
//   );

//   return (
//     <div className="space-y-6 animate-slide-up">
//       {/* Page Header */}
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <h1 className="text-3xl mb-2">Dashboard Tổng Quan</h1>
//           <p className="text-gray-600">Xin chào Admin, đây là tổng quan hệ thống hôm nay</p>
//         </div>

//         <button
//           onClick={reload}
//           className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
//           title="Tải lại"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       {/* Loading / Error */}
//       {loading && <p className="text-sm text-gray-500">Đang tải dữ liệu dashboard...</p>}
//       {error && (
//         <div className="text-sm text-red-600">
//           Lỗi: {error}{" "}
//           <button className="underline" onClick={reload}>
//             Thử lại
//           </button>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsCards.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <Card
//               key={stat.title}
//               className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
//                   >
//                     <Icon className="w-7 h-7 text-white" />
//                   </div>
//                   <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="flex items-center gap-1">
//                     {stat.trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
//                     {stat.change}
//                   </Badge>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
//                 <p className="text-2xl">{stat.value}</p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Extra Admin KPIs */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Total Users */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="w-5 h-5 text-[#007BFF]" />
//               Tổng số người dùng
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="text-3xl">{formatNumber(adminKpis.totalUsers)}</p>
//               </div>

//               <div className="flex flex-col items-end gap-2">
//                 <Badge variant="secondary">Total</Badge>
//                 <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
//                   <ArrowUp className="w-3 h-3" />
//                   +3.1%
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 h-16">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={kpiTrends.users} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#007BFF" stopOpacity={0.25} />
//                       <stop offset="100%" stopColor="#007BFF" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#007BFF"
//                     strokeWidth={2.5}
//                     fill="url(#usersFill)"
//                     dot={false}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Total Orders */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <ShoppingCart className="w-5 h-5 text-[#007BFF]" />
//               Tổng đơn hàng
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="text-3xl">{formatNumber(adminKpis.totalOrders)}</p>
//               </div>

//               <div className="flex flex-col items-end gap-2">
//                 <Badge variant="secondary">Total</Badge>
//                 <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
//                   <ArrowUp className="w-3 h-3" />
//                   +6.7%
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 h-16">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={kpiTrends.orders} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
//                       <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#8B5CF6"
//                     strokeWidth={2.5}
//                     fill="url(#ordersFill)"
//                     dot={false}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Ratings distribution */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Star className="w-5 h-5 text-yellow-500" />
//               Đánh giá
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-end justify-between gap-3">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-3xl">{avgRating.toFixed(2)}</p>
//                   <span className="text-gray-500">/ 5</span>
//                 </div>
//                 <p className="text-xs text-gray-500">Tổng {formatNumber(totalReviews)} đánh giá</p>
//               </div>
//               <Badge className="flex items-center gap-1" variant="secondary">
//                 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                 Avg
//               </Badge>
//             </div>

//             <div className="mt-4 space-y-2">
//               {[5, 4, 3, 2, 1].map((star) => {
//                 const count = adminKpis.ratings[star as 1 | 2 | 3 | 4 | 5];
//                 const p = Math.round((count / maxStarCount) * 100);
//                 return (
//                   <div key={star} className="flex items-center gap-2">
//                     <div className="w-10 text-xs text-gray-600">{star}★</div>
//                     <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
//                       <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${p}%` }} />
//                     </div>
//                     <div className="w-14 text-right text-xs text-gray-600">{formatNumber(count)}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Chart */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-[#007BFF]" />
//               Doanh thu 7 ngày
//             </CardTitle>
//             <CardDescription>Theo dõi doanh thu và số đơn hàng</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#007BFF" strokeWidth={3} name="Doanh thu (k)" />
//                 <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={3} name="Đơn hàng" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Service Distribution */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Activity className="w-5 h-5 text-[#007BFF]" />
//               Phân bố dịch vụ
//             </CardTitle>
//             <CardDescription>Loại dịch vụ được yêu cầu nhiều nhất</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={serviceData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {serviceData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tables Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Technicians */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Star className="w-5 h-5 text-yellow-500" />
//               Top Thợ Xuất Sắc
//             </CardTitle>
//             <CardDescription>Được đánh giá cao nhất tháng này</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {topTechnicians.map((tech, index) => (
//                 <div
//                   key={tech.id}
//                   className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
//                 >
//                   <div className="relative">
//                     <div
//                       className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
//                         index === 0
//                           ? "bg-gradient-to-br from-yellow-400 to-orange-500"
//                           : index === 1
//                             ? "bg-gradient-to-br from-gray-400 to-gray-500"
//                             : index === 2
//                               ? "bg-gradient-to-br from-orange-600 to-orange-700"
//                               : "bg-gradient-to-br from-blue-500 to-purple-600"
//                       }`}
//                     >
//                       {index + 1}
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium group-hover:text-[#007BFF] transition-colors">{tech.name}</p>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                       <span>{tech.rating}</span>
//                       <span>•</span>
//                       <span>{tech.jobs} việc</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-green-600">{tech.revenue}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Orders */}
//         <Card className="shadow-lg border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="w-5 h-5 text-[#007BFF]" />
//               Đơn Hàng Gần Đây
//             </CardTitle>
//             <CardDescription>Cập nhật thời gian thực</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentOrders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <p className="font-medium text-[#007BFF]">{order.id}</p>
//                       <Badge
//                         variant={
//                           order.status === "Hoàn thành"
//                             ? "default"
//                             : order.status === "Đang làm"
//                               ? "secondary"
//                               : "outline"
//                         }
//                         className="text-xs"
//                       >
//                         {order.status}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       {order.customer} - {order.service}
//                     </p>
//                     <p className="text-xs text-gray-400">{order.time}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium text-green-600">{order.amount}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* AI Activity */}
//       <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Brain className="w-5 h-5 text-purple-600" />
//             Hoạt Động AI Hôm Nay
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Tư vấn AI</p>
//               <p className="text-2xl text-purple-600">234</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Phân tích lỗi</p>
//               <p className="text-2xl text-blue-600">189</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Gợi ý thợ</p>
//               <p className="text-2xl text-green-600">342</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl">
//               <p className="text-gray-600 text-sm mb-1">Độ chính xác</p>
//               <p className="text-2xl text-orange-600">94.5%</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
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

// ===== Mock data for charts / tables (UI only) =====
const revenueData = [
  { name: "T2", revenue: 4200, orders: 24 },
  { name: "T3", revenue: 5100, orders: 32 },
  { name: "T4", revenue: 4800, orders: 28 },
  { name: "T5", revenue: 6300, orders: 38 },
  { name: "T6", revenue: 7200, orders: 42 },
  { name: "T7", revenue: 8100, orders: 48 },
  { name: "CN", revenue: 5900, orders: 35 },
];

const serviceData = [
  { name: "Điện", value: 35, color: "#FCD34D" },
  { name: "Nước", value: 25, color: "#3B82F6" },
  { name: "Máy lạnh", value: 20, color: "#06B6D4" },
  { name: "Máy giặt", value: 12, color: "#8B5CF6" },
  { name: "Khác", value: 8, color: "#10B981" },
];

const topTechnicians = [
  { id: 1, name: "Nguyễn Văn A", rating: 4.9, jobs: 234, revenue: "₫15,200,000" },
  { id: 2, name: "Trần Minh B", rating: 4.8, jobs: 189, revenue: "₫12,800,000" },
  { id: 3, name: "Lê Hoàng C", rating: 5.0, jobs: 156, revenue: "₫11,500,000" },
  { id: 4, name: "Phạm Thị D", rating: 4.7, jobs: 142, revenue: "₫9,800,000" },
  { id: 5, name: "Vũ Minh E", rating: 4.9, jobs: 138, revenue: "₫9,200,000" },
];

const recentOrders = [
  {
    id: "#1245",
    customer: "Nguyễn A",
    service: "Sửa điện",
    status: "Đang làm",
    amount: "₫350,000",
    time: "10 phút trước",
  },
  {
    id: "#1244",
    customer: "Trần B",
    service: "Máy lạnh",
    status: "Hoàn thành",
    amount: "₫500,000",
    time: "25 phút trước",
  },
  {
    id: "#1243",
    customer: "Lê C",
    service: "Sửa nước",
    status: "Đang tìm thợ",
    amount: "₫280,000",
    time: "35 phút trước",
  },
  {
    id: "#1242",
    customer: "Phạm D",
    service: "Máy giặt",
    status: "Hoàn thành",
    amount: "₫420,000",
    time: "1 giờ trước",
  },
];

// Base trend mock (sẽ scale theo số API để khớp)
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

function formatNumber(n: number) {
  return (n || 0).toLocaleString("vi-VN");
}

function calcRatingSummary(ratings: Record<1 | 2 | 3 | 4 | 5, number>) {
  const total = ratings[1] + ratings[2] + ratings[3] + ratings[4] + ratings[5];
  const weighted = ratings[1] * 1 + ratings[2] * 2 + ratings[3] * 3 + ratings[4] * 4 + ratings[5] * 5;
  const avg = total === 0 ? 0 : weighted / total;
  return { total, avg };
}

function scaleTrend(trend: { name: string; value: number }[], target: number) {
  const last = trend[trend.length - 1]?.value ?? 1;
  const ratio = last > 0 ? target / last : 1;
  if (!target) return trend; // nếu target = 0 thì giữ trend gốc để không bị all 0
  return trend.map((p) => ({ ...p, value: Math.round(p.value * ratio) }));
}

export function AdminOverview() {
  // Hook 1: KPI dưới (total users / total orders / ratings)
  const { totalUsers, totalOrders, ratings, loading, error, reload } = useDashboardStats();

  // Hook 2: 4 card trên cùng (revenue7d / ordersToday / activeWorkers / newUsersToday)
  const {
    revenue7d,
    ordersToday,
    activeWorkers,
    newUsersToday,
    loading: topLoading,
    error: topError,
    reload: reloadTop,
  } = useAdminTopCards();

  // ✅ stats cards PHẢI nằm trong component (vì dùng biến từ hook)
  const statsCards = [
    {
      title: "Tổng doanh thu (7 ngày)",
      value: `₫${(revenue7d || 0).toLocaleString("vi-VN")}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Đơn hàng hôm nay",
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
    ratings:
      (ratings as Record<1 | 2 | 3 | 4 | 5, number>) ||
      ({ 5: 5231, 4: 2478, 3: 641, 2: 187, 1: 105 } as Record<1 | 2 | 3 | 4 | 5, number>),
  };

  const kpiTrends = {
    users: scaleTrend(baseTrends.users, adminKpis.totalUsers),
    orders: scaleTrend(baseTrends.orders, adminKpis.totalOrders),
  };

  const { total: totalReviews, avg: avgRating } = calcRatingSummary(adminKpis.ratings);

  const maxStarCount = Math.max(
    adminKpis.ratings[1],
    adminKpis.ratings[2],
    adminKpis.ratings[3],
    adminKpis.ratings[4],
    adminKpis.ratings[5],
    1,
  );

  const isRefreshing = loading || topLoading;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl mb-2">Dashboard Tổng Quan</h1>
          <p className="text-gray-600">Xin chào Admin, đây là tổng quan hệ thống hôm nay</p>
        </div>

        <button
          onClick={() => {
            reload();
            reloadTop();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          title="Tải lại"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Loading / Error */}
      {(loading || topLoading) && <p className="text-sm text-gray-500">Đang tải dữ liệu dashboard...</p>}

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

      {/* Stats Cards (Top 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="flex items-center gap-1">
                    {stat.trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Extra Admin KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#007BFF]" />
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
                      <stop offset="0%" stopColor="#007BFF" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#007BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#007BFF"
                    strokeWidth={2.5}
                    fill="url(#usersFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#007BFF]" />
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
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fill="url(#ordersFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ratings distribution */}
        <Card className="shadow-lg border-0">
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
                  <p className="text-3xl">{avgRating.toFixed(2)}</p>
                  <span className="text-gray-500">/ 5</span>
                </div>
                <p className="text-xs text-gray-500">Tổng {formatNumber(totalReviews)} đánh giá</p>
              </div>
              <Badge className="flex items-center gap-1" variant="secondary">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                Avg
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = adminKpis.ratings[star as 1 | 2 | 3 | 4 | 5];
                const p = Math.round((count / maxStarCount) * 100);
                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="w-10 text-xs text-gray-600">{star}★</div>
                    <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${p}%` }} />
                    </div>
                    <div className="w-14 text-right text-xs text-gray-600">{formatNumber(count)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#007BFF]" />
              Doanh thu 7 ngày
            </CardTitle>
            <CardDescription>Theo dõi doanh thu và số đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#007BFF" strokeWidth={3} name="Doanh thu (k)" />
                <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={3} name="Đơn hàng" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#007BFF]" />
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
      </div>

      {/* Tables Row */}
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
              {topTechnicians.map((tech, index) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-400 to-gray-500"
                            : index === 2
                              ? "bg-gradient-to-br from-orange-600 to-orange-700"
                              : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-[#007BFF] transition-colors">{tech.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{tech.rating}</span>
                      <span>•</span>
                      <span>{tech.jobs} việc</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">{tech.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#007BFF]" />
              Đơn Hàng Gần Đây
            </CardTitle>
            <CardDescription>Cập nhật thời gian thực</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[#007BFF]">{order.id}</p>
                      <Badge
                        variant={
                          order.status === "Hoàn thành"
                            ? "default"
                            : order.status === "Đang làm"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customer} - {order.service}
                    </p>
                    <p className="text-xs text-gray-400">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Activity */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Hoạt Động AI Hôm Nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Tư vấn AI</p>
              <p className="text-2xl text-purple-600">234</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Phân tích lỗi</p>
              <p className="text-2xl text-blue-600">189</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Gợi ý thợ</p>
              <p className="text-2xl text-green-600">342</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Độ chính xác</p>
              <p className="text-2xl text-orange-600">94.5%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
