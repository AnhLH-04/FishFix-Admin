import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type Item = {
  id: string;
  title: string;
  customer: string;
  status: "completed" | "canceled";
  completedDate?: string;
  total?: string;
  rating?: number;
};

const mock: Item[] = [
  {
    id: "ORD-77421",
    title: "Vệ sinh máy lạnh Inverter",
    customer: "Anh Trần Minh",
    status: "completed",
    completedDate: "14/10/2023",
    total: "350.000đ",
    rating: 5,
  },
  {
    id: "ORD-77395",
    title: "Sửa tủ lạnh không đông đá",
    customer: "Chị Lan",
    status: "canceled",
    completedDate: "12/10/2023",
  },
  {
    id: "ORD-77312",
    title: "Lắp đặt máy giặt cửa ngang",
    customer: "Anh Hoàng",
    status: "completed",
    completedDate: "10/10/2023",
    total: "250.000đ",
    rating: 5,
  },
];

export default function TechHistoryPage() {
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const data = useMemo(() => {
    const x = kw.trim().toLowerCase();
    return mock.filter((m) => {
      if (!x) return true;
      return (
        m.title.toLowerCase().includes(x) || m.customer.toLowerCase().includes(x) || m.id.toLowerCase().includes(x)
      );
    });
  }, [kw]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Lịch sử sửa chữa</h1>
        <p className="text-sm text-gray-600 mt-1">
          Xem và quản lý tất cả các đơn hàng đã hoàn thành hoặc đã hủy của bạn.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="Tìm theo tên khách hàng, số điện thoại hoặc mã..."
              className="pl-9 rounded-xl bg-gray-50 border-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Từ ngày:</span>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-[140px] rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Đến ngày:</span>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-[140px] rounded-xl"
            />
          </div>

          <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">Lọc</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {data.map((it) => (
          <Card key={it.id} className="rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-extrabold text-gray-900">{it.title}</div>
                  {it.status === "completed" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">HOÀN THÀNH</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">ĐÃ HỦY</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Khách hàng: <span className="font-semibold">{it.customer}</span> ·{" "}
                  <span className="text-gray-500">#{it.id}</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-10">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Hoàn thành ngày</div>
                  <div className="font-semibold">{it.completedDate ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Tổng tiền</div>
                  <div className="font-extrabold text-[#007BFF]">{it.total ?? "0đ"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Đánh giá</div>
                  <div className="font-semibold">{it.rating ? "★".repeat(it.rating) : "Không có"}</div>
                </div>
              </div>

              <Button variant="outline" className="rounded-xl">
                Chi tiết
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" className="rounded-xl">
          {"<"}
        </Button>
        <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">1</Button>
        <Button variant="outline" className="rounded-xl">
          2
        </Button>
        <Button variant="outline" className="rounded-xl">
          {">"}
        </Button>
      </div>
    </div>
  );
}
