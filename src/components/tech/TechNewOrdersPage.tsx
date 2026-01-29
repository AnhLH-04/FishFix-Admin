import { useMemo, useState } from "react";
import { MapPin, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Order = {
  id: string;
  device: "Máy lạnh" | "Tủ lạnh" | "Máy giặt" | "Điện lạnh khác";
  title: string;
  customer: string;
  area: string;
  time: string;
  price: string;
  note: string;
  priority?: boolean;
};

const mock: Order[] = [
  {
    id: "ORD-01",
    device: "Máy lạnh",
    title: "Vệ sinh & Nạp gas máy lạnh Inverter",
    customer: "Anh Trần Minh",
    area: "Quận 7, TP.HCM",
    time: "14:30 - Hôm nay (15/10)",
    price: "450.000đ",
    note: "Máy lạnh bốc mùi hôi và chảy nước ở dàn lạnh.",
    priority: true,
  },
  {
    id: "ORD-02",
    device: "Tủ lạnh",
    title: "Sửa tủ lạnh Side-by-side không đông đá",
    customer: "Chị Lan Phương",
    area: "Bình Thạnh, TP.HCM",
    time: "08:30 - Ngày mai (16/10)",
    price: "Thỏa thuận",
    note: "Ngăn đá không lạnh, thức ăn bị rã đông.",
  },
  {
    id: "ORD-03",
    device: "Máy giặt",
    title: "Lắp đặt máy giặt cửa ngang mới",
    customer: "Anh Hoàng",
    area: "Quận 2 (Thủ Đức), TP.HCM",
    time: "10:00 - Ngày mai (16/10)",
    price: "250.000đ",
    note: "Cần lắp đặt và cân chỉnh máy.",
  },
  {
    id: "ORD-04",
    device: "Điện lạnh khác",
    title: "Kiểm tra bảo trì máy làm đá công nghiệp",
    customer: "Quán Cafe Horizon",
    area: "Quận 1, TP.HCM",
    time: "15:00 - Thứ Tư (17/10)",
    price: "Liên hệ",
    note: "Máy ra đá chậm và có tiếng kêu lạ.",
  },
];

export default function TechNewOrdersPage() {
  const [device, setDevice] = useState<string>("all");
  const [area, setArea] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  const data = useMemo(() => {
    let arr = [...mock];
    if (device !== "all") arr = arr.filter((x) => x.device === device);
    if (area !== "all") arr = arr.filter((x) => x.area.includes(area));
    if (sort === "newest") arr = arr; // mock
    return arr;
  }, [device, area, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Danh sách Đơn hàng mới</h1>
        <p className="text-sm text-gray-600 mt-1">Bạn đang có {data.length} đơn hàng mới trong khu vực của mình.</p>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="grid lg:grid-cols-4 gap-3 items-end">
            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">LOẠI THIẾT BỊ</div>
              <Select value={device} onValueChange={setDevice}>
                <SelectTrigger className="rounded-xl bg-gray-50 border-0">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thiết bị</SelectItem>
                  <SelectItem value="Máy lạnh">Máy lạnh</SelectItem>
                  <SelectItem value="Tủ lạnh">Tủ lạnh</SelectItem>
                  <SelectItem value="Máy giặt">Máy giặt</SelectItem>
                  <SelectItem value="Điện lạnh khác">Điện lạnh khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">KHU VỰC</div>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="rounded-xl bg-gray-50 border-0">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Quận/Huyện</SelectItem>
                  <SelectItem value="Quận 7">Quận 7</SelectItem>
                  <SelectItem value="Bình Thạnh">Bình Thạnh</SelectItem>
                  <SelectItem value="Quận 2">Quận 2</SelectItem>
                  <SelectItem value="Quận 1">Quận 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">SẮP XẾP</div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="rounded-xl bg-gray-50 border-0">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="nearest">Gần nhất</SelectItem>
                  <SelectItem value="price">Giá cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button variant="link" className="px-0 text-[#007BFF]">
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards grid */}
      <div className="grid xl:grid-cols-2 gap-4">
        {data.map((o) => (
          <Card key={o.id} className="rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[180px_1fr]">
              {/* left poster */}
              <div
                className="h-full min-h-[190px]"
                style={{
                  background: "linear-gradient(135deg, rgba(0,123,255,0.15), rgba(255,180,0,0.18))",
                }}
              >
                <div className="p-3">
                  {o.priority && <Badge className="bg-orange-500 hover:bg-orange-500">Ưu tiên</Badge>}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="secondary" className="rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                      {o.device.toUpperCase()}
                    </Badge>
                    <div className="mt-2 font-extrabold text-gray-900">{o.title}</div>
                  </div>
                  <div className="text-[#007BFF] font-extrabold">{o.price}</div>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      Khách: <span className="font-semibold">{o.customer}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{o.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{o.time}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 italic border-l-2 pl-3">“{o.note}”</div>

                <div className="mt-4 flex gap-2">
                  <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">Chấp nhận</Button>
                  <Button variant="outline" className="rounded-xl">
                    Từ chối
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination (demo) */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" className="rounded-xl">
          {"<"}
        </Button>
        <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">1</Button>
        <Button variant="outline" className="rounded-xl">
          2
        </Button>
        <Button variant="outline" className="rounded-xl">
          3
        </Button>
        <Button variant="outline" className="rounded-xl">
          {">"}
        </Button>
      </div>
    </div>
  );
}
