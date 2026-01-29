import { useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { technicians, labelService, type Technician } from "./technicianData";
import {
  ArrowLeft,
  BadgeCheck,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  CalendarDays,
} from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hashToInt(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function estimateYears(t: Technician) {
  return clamp(Math.round(t.jobsDone / 40), 1, 12);
}

function estimatePriceRange(t: Technician) {
  const base = 120_000 + t.distanceKm * 20_000;
  const min = Math.round(base / 10_000) * 10_000;
  const max = Math.round((min + 250_000 + (t.rating - 4.4) * 300_000) / 10_000) * 10_000;
  return `${min.toLocaleString("vi-VN")}đ - ${max.toLocaleString("vi-VN")}đ`;
}

function makeSlots(seed: number) {
  // demo lịch trống
  const sets = [
    ["09:00", "11:00", "14:00", "16:00"],
    ["08:30", "10:30", "13:30", "15:30"],
    ["09:30", "12:00", "14:30", "17:00"],
  ];
  return sets[seed % sets.length];
}

type Review = { name: string; date: string; service: string; rating: number; content: string };

function makeReviews(seed: number): Review[] {
  const pool: Review[] = [
    {
      name: "Trần Thị Mai",
      date: "15/01/2026",
      service: "Vệ sinh máy lạnh",
      rating: 5,
      content:
        "Anh An làm việc rất chuyên nghiệp, tận tâm. Máy lạnh được vệ sinh sạch sẽ, lạnh hơn hẳn. Giá cả hợp lý, bảo hành chu đáo.",
    },
    {
      name: "Lê Văn Hùng",
      date: "10/01/2026",
      service: "Sửa máy lạnh không lạnh",
      rating: 5,
      content: "Sửa nhanh, đúng hẹn. Anh thợ nhiệt tình, giải thích rõ ràng vấn đề. Rất hài lòng!",
    },
    {
      name: "Phạm Minh Tuấn",
      date: "05/01/2026",
      service: "Nạp gas điều hòa",
      rating: 4,
      content: "Dịch vụ tốt, giá cả phải chăng. Đến đúng giờ hẹn. Nếu có lần sau sẽ tiếp tục sử dụng.",
    },
  ];

  // đảo nhẹ theo seed cho “đỡ giống nhau”
  const s = seed % pool.length;
  return [...pool.slice(s), ...pool.slice(0, s)];
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < full ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
      ))}
    </span>
  );
}

export default function UserTechnicianProfile() {
  const navigate = useNavigate();
  const query = useQuery();
  const { id = "" } = useParams<{ id: string }>();

  // giữ string end-to-end ✅
  const tech = useMemo(() => technicians.find((x) => x.id === id) ?? null, [id]);

  const service = query.get("service") ?? "all";
  const fromCategory = query.get("fromCategory") ?? "";
  const fromDetailId = query.get("fromDetailId") ?? "";

  const [pickedSlot, setPickedSlot] = useState<string | null>(null);

  if (!tech) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Không tìm thấy thợ</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/technicians")}>Quay lại danh sách thợ</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const years = estimateYears(tech);
  const priceRange = estimatePriceRange(tech);
  const reviewsCount = Math.max(10, Math.round(tech.jobsDone * 0.75));
  const addressText = `Quận 1, TP.HCM • ${tech.distanceKm.toFixed(1)} km`;
  const seed = hashToInt(tech.id);
  const slots = makeSlots(seed);
  const reviews = makeReviews(seed);

  const goBack = () => {
    if (fromCategory && fromDetailId) return navigate(`/services/${fromCategory}/${fromDetailId}`);
    return navigate(-1);
  };

  const ctaBooking = () => {
    // bạn có thể điều hướng tới booking của bạn
    const params = new URLSearchParams();
    params.set("technicianId", tech.id);
    if (service && service !== "all") params.set("service", service);
    if (pickedSlot) params.set("slot", pickedSlot);
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <button className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Header card */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-5">
                  <div className="shrink-0">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 ring-4 ring-white shadow-sm">
                      <img
                        src={
                          tech.avatarUrl ??
                          `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(tech.name)}`
                        }
                        alt={tech.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if (!img.dataset.f1) {
                            img.dataset.f1 = "1";
                            img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(tech.id)}`;
                            return;
                          }
                          img.src = `https://placehold.co/160x160/png?text=${encodeURIComponent(
                            tech.name.split(" ").slice(-1)[0] ?? "User",
                          )}`;
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 truncate">{tech.name}</h1>
                          <Badge className="bg-amber-400/90 text-slate-900 hover:bg-amber-400/90">🏅 Top thợ</Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                              tech.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                            {tech.available ? "Sẵn sàng" : "Bận"}
                          </span>

                          <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <b>{tech.rating.toFixed(1)}</b>
                            <span className="text-slate-500">({reviewsCount} đánh giá)</span>
                          </span>

                          <span className="text-slate-300">•</span>

                          <span className="text-sm text-slate-700">
                            <b>{tech.jobsDone}</b> việc hoàn thành
                          </span>
                        </div>

                        <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-slate-600">
                          <div className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            {years} năm kinh nghiệm
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            {addressText}
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <BadgeDollarSign className="h-4 w-4 text-blue-600" />
                            {priceRange}
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-emerald-600" />
                            Được xác minh
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-slate-600">
                          Chuyên sửa chữa {tech.services.map((s) => labelService(String(s))).join(", ")}. Tư vấn miễn
                          phí, bảo hành dài hạn. Phục vụ tận tâm, giá cả hợp lý.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Top thợ
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Phổ biến
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Đáng tin cậy
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chuyên môn */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-extrabold text-slate-900">Chuyên môn</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6">
                <div className="flex flex-wrap gap-2">
                  {tech.services.map((s) => (
                    <span
                      key={String(s)}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                    >
                      <BadgeCheck className="h-4 w-4" />
                      {labelService(String(s))}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dịch vụ nhận sửa */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-extrabold text-slate-900">Dịch vụ nhận sửa</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6">
                <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-700">
                  {[
                    "Vệ sinh máy lạnh định kỳ",
                    "Sửa rò rỉ nước, tắc ống thoát",
                    "Sửa máy lạnh không lạnh",
                    "Nạp gas điều hòa R22, R410A, R32",
                    "Thay bo mạch điều hòa",
                    "Thay block compressor",
                  ].map((x) => (
                    <div key={x} className="inline-flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-extrabold text-slate-900">Đánh giá từ khách hàng (3)</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 space-y-6">
                {reviews.map((r, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">{r.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {r.date} • {r.service}
                        </p>
                      </div>
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-3 text-sm text-slate-700">{r.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-extrabold text-slate-900">Đặt lịch với thợ này</CardTitle>
              </CardHeader>

              <CardContent className="pt-4 pb-6 space-y-5">
                <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                  <p className="text-xs text-slate-600">Giá dự kiến</p>
                  <p className="mt-1 text-lg font-extrabold text-blue-700">{priceRange}</p>
                  <p className="mt-1 text-xs text-slate-500">* Giá cuối cùng tùy vào mức độ hư hỏng</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <CalendarDays className="h-4 w-4 text-slate-500" />
                    Lịch trống hôm nay
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPickedSlot(s)}
                        className={`h-11 rounded-xl border px-3 text-sm font-semibold transition
                          ${
                            pickedSlot === s
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-extrabold" onClick={ctaBooking}>
                  Đặt lịch ngay
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-blue-600 text-blue-700 hover:bg-blue-50 font-extrabold"
                  onClick={() => alert(`Gọi ${tech.phone ?? "N/A"}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi ngay
                </Button>

                <Button
                  variant="secondary"
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold"
                  onClick={() => alert(`Nhắn tin cho ${tech.name}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nhắn tin
                </Button>

                <div className="pt-2 border-t border-slate-100 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Thợ được xác minh danh tính
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-blue-600" />
                    Bảo hành dịch vụ lên đến 12 tháng
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4 text-amber-600" />
                    Hoàn tiền 100% nếu không hài lòng
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
