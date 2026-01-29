import { useMemo } from "react";
import { CalendarDays, Star, Wallet2, ChevronRight, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type UpcomingItem = {
  time: string;
  title: string;
  sub: string;
};

const upcoming: UpcomingItem[] = [
  { time: "09:00 - 11:00", title: "Sửa tủ đông Sanaky", sub: "Lê Văn Lương, Q7" },
  { time: "13:00 - 14:00", title: "Nghỉ trưa", sub: "" },
  { time: "15:30 - 17:00", title: "Bảo trì hệ thống VRV", sub: "Chung cư Sunrise City" },
];

export default function TechDashboardPage() {
  const today = useMemo(() => new Date(), []);
  const todayLabel = useMemo(() => format(today, "EEEE, d 'tháng' M, yyyy", { locale: vi }), [today]);

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Chào buổi sáng!</h1>
          <p className="text-sm text-gray-600 mt-1">Hôm nay bạn có {upcoming.length} lịch hẹn đã xác nhận.</p>
        </div>
        <div className="text-sm text-gray-500">{todayLabel}</div>
      </div>

      {/* Stat cards */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wallet2 className="h-5 w-5 text-[#007BFF]" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500">Tổng thu nhập tháng</div>
                <div className="text-2xl font-extrabold text-gray-900">15.200.000đ</div>
                <div className="text-xs text-green-600 font-semibold mt-1">↗ +12.5% so với tháng trước</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500">Đơn hoàn thành</div>
                <div className="text-2xl font-extrabold text-gray-900">42</div>
                <div className="text-xs text-green-600 font-semibold mt-1">↗ +5 đơn mới tuần này</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500">Đánh giá trung bình</div>
                <div className="text-2xl font-extrabold text-gray-900">4.9/5</div>
                <div className="text-xs text-blue-600 font-semibold mt-1">Từ 120 lượt đánh giá</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid xl:grid-cols-[1fr_360px] gap-4">
        {/* Left */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-extrabold">Đơn hàng mới cần xác nhận</CardTitle>
                <Button variant="link" className="text-[#007BFF] px-0">
                  Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: "Vệ sinh máy lạnh Inverter",
                  addr: "Quận 7, TP.HCM",
                  time: "14:30 Hôm nay",
                  price: "350.000đ",
                },
                {
                  title: "Sửa tủ lạnh không đông đá",
                  addr: "Bình Thạnh, TP.HCM",
                  time: "08:00 Ngày mai",
                  price: "Liên hệ báo giá",
                },
                {
                  title: "Lắp đặt máy giặt Electrolux",
                  addr: "Quận 2, TP.HCM",
                  time: "10:30 Ngày mai",
                  price: "250.000đ",
                },
              ].map((o) => (
                <div key={o.title} className="border rounded-2xl p-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-extrabold text-gray-900 truncate">{o.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{o.addr}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">{o.time}</span> ·{" "}
                        <span className="text-[#007BFF] font-extrabold">{o.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">Chấp nhận</Button>
                      <Button variant="outline" className="rounded-xl">
                        Từ chối
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-extrabold">Lịch làm việc hôm nay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar mode="single" selected={today} onSelect={() => {}} className="rounded-2xl border" />

            <div className="space-y-3">
              {upcoming.map((u) => (
                <div key={u.time} className="flex gap-3">
                  <div className="w-2 rounded-full bg-[#007BFF] mt-1.5" />
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-gray-900">{u.time}</div>
                    <div className="text-sm text-gray-700 font-semibold">{u.title}</div>
                    {u.sub && <div className="text-xs text-gray-500 mt-0.5">{u.sub}</div>}
                  </div>
                </div>
              ))}
              <Badge variant="secondary" className="rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                GHI CHÚ CÁ NHÂN: Đi lấy linh kiện thay thế
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-xl">
                Thêm ghi chú
              </Button>
              <Button variant="outline" className="rounded-xl">
                Đánh dấu nghỉ
              </Button>
              <Button className="rounded-xl col-span-2 bg-[#007BFF] hover:bg-[#0b6be0]">
                <Phone className="mr-2 h-4 w-4" />
                Liên hệ tổng đài
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
