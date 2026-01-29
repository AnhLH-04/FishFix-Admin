import { SetStateAction, useMemo, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type DayPlan = { time: string; title: string; sub?: string; color?: "blue" | "gray" | "yellow" };

const plan: DayPlan[] = [
  { time: "08:00 - 10:00", title: "Vệ sinh máy lạnh (Inverter)", sub: "Chung cư Mizuki, Bình Chánh", color: "blue" },
  { time: "12:00 - 13:00", title: "Nghỉ trưa", color: "gray" },
  { time: "14:00 - 15:30", title: "Sửa tủ lạnh không lạnh", sub: "152 Lê Văn Sỹ, Quận 3", color: "blue" },
  { time: "GHI CHÚ", title: "Đi lấy linh kiện thay thế tại kho Quận 7 sau ca chiều.", color: "yellow" },
];

export default function TechSchedulePage() {
  const [date, setDate] = useState<Date>(new Date());
  const dateLabel = useMemo(() => format(date, "EEEE, d 'tháng' M", { locale: vi }), [date]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Lịch làm việc chi tiết</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý ca làm việc và thời gian nghỉ của bạn</p>
        </div>
        <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">+ Đăng ký nghỉ</Button>
      </div>

      <div className="grid xl:grid-cols-[1fr_360px] gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Tháng {format(date, "MM, yyyy")}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl">
                Tháng
              </Button>
              <Button variant="outline" className="rounded-xl">
                Tuần
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d: SetStateAction<Date>) => d && setDate(d)}
              className="rounded-2xl border"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-extrabold">{dateLabel}</CardTitle>
            <p className="text-sm text-gray-600">
              Bạn có {plan.filter((p) => p.color !== "yellow").length} lịch hẹn hôm nay
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.map((p, idx) => {
              const dot = p.color === "blue" ? "bg-[#007BFF]" : p.color === "yellow" ? "bg-yellow-400" : "bg-gray-300";
              const box =
                p.color === "yellow"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-900"
                  : p.color === "gray"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-200";

              return (
                <div key={idx} className={`border rounded-2xl p-3 ${box}`}>
                  {p.time === "GHI CHÚ" ? (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">GHI CHÚ CÁ NHÂN</Badge>
                  ) : (
                    <div className="text-sm font-extrabold text-gray-900">{p.time}</div>
                  )}
                  <div className="flex gap-3 mt-2">
                    <div className={`w-2 rounded-full ${dot}`} />
                    <div className="flex-1">
                      <div className="font-semibold">{p.title}</div>
                      {p.sub && <div className="text-xs text-gray-500 mt-1">{p.sub}</div>}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-xl">
                + Thêm ghi chú cá nhân
              </Button>
              <Button variant="outline" className="rounded-xl">
                Đánh dấu thời gian nghỉ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
