import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Tx = {
  id: string;
  date: string;
  type: "income" | "fee" | "withdraw";
  amount: number;
  status: "success" | "pending";
  note: string;
};

const weekly = [
  { name: "Tuần 1", value: 250000 },
  { name: "Tuần 2", value: 620000 },
  { name: "Tuần 3", value: 480000 },
  { name: "Tuần 4", value: 800000 },
];

const txs: Tx[] = [
  {
    id: "ORD-9912",
    date: "15/10/2023 16:45",
    type: "income",
    amount: 350000,
    status: "success",
    note: "Tiền công #ORD-9912",
  },
  {
    id: "FEE-9912",
    date: "15/10/2023 16:45",
    type: "fee",
    amount: -52500,
    status: "success",
    note: "Phí hệ thống (15%)",
  },
  {
    id: "WD-4481",
    date: "14/10/2023 09:20",
    type: "withdraw",
    amount: -1000000,
    status: "pending",
    note: "Lệnh rút tiền về ngân hàng",
  },
  {
    id: "ORD-9885",
    date: "13/10/2023 11:30",
    type: "income",
    amount: 800000,
    status: "success",
    note: "Tiền công #ORD-9885",
  },
];

function money(n: number) {
  const sign = n < 0 ? "-" : "+";
  const v = Math.abs(n).toLocaleString("vi-VN");
  return `${sign}${v}đ`;
}

export default function TechWalletPage() {
  const [range, setRange] = useState<"week" | "month">("week");

  const summary = useMemo(() => {
    const totalIncome = 15200000;
    const fee = -2280000;
    const net = totalIncome + fee;
    return { totalIncome, fee, net };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Ví & Thu nhập</h1>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50" />
            <div>
              <div className="text-xs font-bold text-gray-500">SỐ DƯ HIỆN TẠI</div>
              <div className="text-3xl font-extrabold text-gray-900">2.450.000đ</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="rounded-xl bg-[#007BFF] hover:bg-[#0b6be0]">Rút tiền</Button>
            <Button variant="outline" className="rounded-xl">
              Yêu cầu rút
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid xl:grid-cols-[1fr_360px] gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-base font-extrabold">Biểu đồ thu nhập</CardTitle>
            <Select value={range} onValueChange={(v: any) => setRange(v as any)}>
              <SelectTrigger className="w-[140px] rounded-xl bg-gray-50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent> 
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-extrabold">Tóm tắt tháng này</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tổng thu (tạm tính)</span>
              <span className="font-extrabold">{summary.totalIncome.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Phí hệ thống (15%)</span>
              <span className="font-extrabold text-red-600">{summary.fee.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between text-sm">
              <span className="text-gray-900 font-bold">Thu nhập ròng</span>
              <span className="font-extrabold text-[#007BFF]">{summary.net.toLocaleString("vi-VN")}đ</span>
            </div>

            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-gray-700">
              <div className="text-xs font-bold text-blue-700 mb-1">CHU KỲ THANH TOÁN</div>
              <div>Tiền công sẽ được tự động cộng vào ví sau 24h kể từ khi đơn hàng hoàn thành.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <CardTitle className="text-base font-extrabold">Lịch sử giao dịch chi tiết</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              Bộ lọc
            </Button>
            <Button variant="outline" className="rounded-xl">
              Xuất báo cáo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-6 text-xs font-bold text-gray-500 px-2">
            <div className="col-span-2">GIAO DỊCH / ID</div>
            <div>NGÀY THỰC HIỆN</div>
            <div>LOẠI</div>
            <div>SỐ TIỀN</div>
            <div>TRẠNG THÁI</div>
          </div>

          {txs.map((t) => (
            <div key={t.id} className="grid grid-cols-6 items-center bg-white border rounded-2xl p-3">
              <div className="col-span-2">
                <div className="font-extrabold text-gray-900">{t.note}</div>
                <div className="text-xs text-gray-500">#{t.id}</div>
              </div>
              <div className="text-sm text-gray-600">{t.date}</div>
              <div className="text-sm text-gray-600">
                {t.type === "income" ? "Thu nhập" : t.type === "fee" ? "Phí" : "Rút tiền"}
              </div>
              <div className={`font-extrabold ${t.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                {money(t.amount)}
              </div>
              <div>
                {t.status === "success" ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Thành công</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Đang xử lý</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
