import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, CalendarDays, Clock, MapPin, Phone, User, Wrench, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { bookingApi, bidApi, jobApi, dispatchApi, type WorkerProfile, type BookingApiRecord } from "../../services/api";
import { cn } from "../ui/utils";

/** Khớp với UserTechnicians / backend categoryId mặc định */
const SERVICE_SLUG_TO_CATEGORY_ID: Record<string, number> = {
  electric: 1,
  plumbing: 2,
  hvac: 3,
  painting: 4,
  electronics: 5,
  vehicle: 6,
  woodwork: 7,
  cleaning: 8,
};

const services = [
  { value: "electric", label: "Sửa Điện" },
  { value: "plumbing", label: "Sửa Nước" },
  { value: "hvac", label: "Điều Hòa" },
  { value: "painting", label: "Sơn Nhà" },
  { value: "electronics", label: "Sửa Điện Tử" },
  { value: "woodwork", label: "Mộc & Đồ Gỗ" },
  { value: "vehicle", label: "Sửa Xe" },
  { value: "cleaning", label: "Vệ Sinh" },
];

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

function parseSlotToPreferredTimes(slot: string): { start: string; end: string } {
  const parts = slot.split(/\s*-\s*/).map((s) => s.trim());
  const toHms = (t: string) => {
    const seg = t.split(":");
    if (seg.length === 2) return `${t}:00`;
    return t;
  };
  return { start: toHms(parts[0] ?? "09:00"), end: toHms(parts[1] ?? "18:00") };
}

function parseBidId(data: { bidId?: string } | string): string {
  if (typeof data === "string" && data.length > 0) return data;
  if (data && typeof data === "object" && typeof data.bidId === "string") return data.bidId;
  throw new Error("Không lấy được bidId từ máy chủ");
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  paid: "Đã cọc",
  in_progress: "Đang làm",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  payment_expired: "Thanh toán hết hạn",
  arrived: "Thợ đã đến",
};

/** Ngày có booking chưa kết thúc — gợi ý trên lịch (không chặn chọn ngày) */
const BUSY_BOOKING_STATUS = new Set(["pending", "confirmed", "paid", "in_progress", "arrived"]);

function formatVnd(n: number | undefined | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export function UserBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const technicianId = searchParams.get("technicianId")?.trim() || "";

  const [isLoading, setIsLoading] = useState(false);
  const [workerLoading, setWorkerLoading] = useState(false);
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [workerBookings, setWorkerBookings] = useState<BookingApiRecord[]>([]);
  const [workerBookingsLoading, setWorkerBookingsLoading] = useState(false);

  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    timeSlot: "",
    description: "",
    estimatedBudget: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const serviceFromUrl = searchParams.get("service")?.trim();
  useEffect(() => {
    if (serviceFromUrl && services.some((s) => s.value === serviceFromUrl)) {
      setFormData((prev) => ({ ...prev, service: serviceFromUrl }));
    }
  }, [serviceFromUrl]);

  const loadWorker = useCallback(async () => {
    if (!technicianId) {
      setWorker(null);
      return;
    }
    setWorkerLoading(true);
    try {
      const profile = await dispatchApi.getWorkerProfile(technicianId);
      setWorker(profile);
    } catch {
      setWorker(null);
      toast.error("Không tải được hồ sơ thợ. Vẫn có thể thử đặt lịch nếu ID đúng.");
    } finally {
      setWorkerLoading(false);
    }
  }, [technicianId]);

  const loadWorkerBookings = useCallback(async () => {
    if (!technicianId) {
      setWorkerBookings([]);
      return;
    }
    setWorkerBookingsLoading(true);
    try {
      const list = await bookingApi.getBookings({ workerId: technicianId });
      const sorted = [...list].sort((a, b) => {
        const da = String(a.scheduledDate ?? a.createdAt ?? "");
        const db = String(b.scheduledDate ?? b.createdAt ?? "");
        return db.localeCompare(da);
      });
      setWorkerBookings(sorted.slice(0, 14));
    } catch {
      setWorkerBookings([]);
      toast.error("Không tải được lịch booking của thợ.");
    } finally {
      setWorkerBookingsLoading(false);
    }
  }, [technicianId]);

  useEffect(() => {
    void loadWorker();
  }, [loadWorker]);

  useEffect(() => {
    void loadWorkerBookings();
  }, [loadWorkerBookings]);

  const workerBusyYmd = useMemo(() => {
    const s = new Set<string>();
    for (const b of workerBookings) {
      const st = String(b.status ?? "").toLowerCase();
      const ymd = b.scheduledDate;
      if (!ymd || !BUSY_BOOKING_STATUS.has(st)) continue;
      s.add(ymd);
    }
    return s;
  }, [workerBookings]);

  const selectedYmd = date ? format(date, "yyyy-MM-dd") : null;
  const selectedDayHasWorkerBusy = selectedYmd != null && workerBusyYmd.has(selectedYmd);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!technicianId) {
      toast.error("Vui lòng chọn thợ từ danh sách thợ trước khi đặt lịch.");
      return;
    }

    if (!user?.userId) {
      toast.error("Không xác định được tài khoản. Vui lòng đăng nhập lại.");
      return;
    }

    if (!date) {
      toast.error("Vui lòng chọn ngày");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.service || !formData.timeSlot) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const categoryId = SERVICE_SLUG_TO_CATEGORY_ID[formData.service];
    if (!categoryId) {
      toast.error("Dịch vụ không hợp lệ");
      return;
    }

    const budgetNum = Number(String(formData.estimatedBudget).replace(/\D/g, "")) || 0;
    if (budgetNum < 1) {
      toast.error("Vui lòng nhập ngân sách dự kiến (VNĐ) — tối thiểu 1");
      return;
    }

    const { start: preferredTimeStart, end: preferredTimeEnd } = parseSlotToPreferredTimes(formData.timeSlot);
    const scheduledDate = format(date, "yyyy-MM-dd");
    const serviceLabel = services.find((s) => s.value === formData.service)?.label ?? "Dịch vụ";
    const title = `${serviceLabel} — ${formData.address.slice(0, 48)}`;
    const descriptionBody =
      formData.description.trim() ||
      `Đặt lịch qua ứng dụng FishFix. Dịch vụ: ${serviceLabel}. Khách: ${formData.name} — ${formData.phone}`;

    setIsLoading(true);
    try {
      const job = await jobApi.createJob({
        customerId: user.userId,
        categoryId,
        title,
        description: descriptionBody,
        address: formData.address,
        estimatedBudget: budgetNum,
        preferredDate: scheduledDate,
        preferredTimeStart,
        preferredTimeEnd,
      });

      const jobId = String(job.jobId ?? job.id ?? "");
      if (!jobId) {
        throw new Error("Tạo công việc thất bại: thiếu jobId");
      }

      const bidRaw = await bidApi.createBid(jobId, {
        workerId: technicianId,
        amount: budgetNum,
        message: `Đặt lịch: ${scheduledDate} ${formData.timeSlot}. ${descriptionBody.slice(0, 200)}`,
      });
      const bidId = parseBidId(bidRaw);

      await bidApi.acceptBid(bidId);

      const depositAmount = Math.round(budgetNum * 0.3);

      const bookingId = await bookingApi.createBooking({
        jobId,
        bidId,
        customerId: user.userId,
        workerId: technicianId,
        finalAmount: budgetNum,
        scheduledDate,
        scheduledTimeStart: preferredTimeStart,
        scheduledTimeEnd: preferredTimeEnd,
        depositAmount,
      });

      toast.success("Đặt lịch thành công! Kiểm tra đơn hàng để thanh toán cọc nếu cần.");
      void loadWorkerBookings();
      setTimeout(() => navigate("/orders"), 1600);
      console.log("Booking ID:", bookingId);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || "Đặt lịch thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const displayWorkerName = worker?.fullName || (technicianId ? `Thợ #${technicianId.slice(0, 8)}…` : "—");

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-linear-to-b from-background to-muted/25 dark:from-background dark:to-muted/10">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div {...fadeUp} className="mb-8">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Đặt lịch sửa chữa</h1>
        </motion.div>

        {!technicianId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 flex gap-3 items-start dark:bg-card/60"
          >
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">Chưa chọn thợ</p>
              <p className="text-sm text-muted-foreground">
                Để gọi đúng API booking theo thợ, hãy mở trang từ &quot;Đặt lịch&quot; trên hồ sơ thợ.
              </p>
              <Button asChild variant="default" size="sm" className="rounded-lg">
                <Link to="/technicians">Chọn thợ</Link>
              </Button>
            </div>
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="border-border/60 shadow-xl bg-card/80 dark:bg-card/60 backdrop-blur-md">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Thông tin đặt lịch</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      <User className="inline h-4 w-4 mr-2" />
                      Họ và tên *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Địa chỉ *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      className="rounded-lg min-h-[88px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service">Dịch vụ cần sửa *</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value: string) => handleInputChange("service", value)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Ngân sách dự kiến (VNĐ) *</Label>
                    <Input
                      id="budget"
                      inputMode="numeric"
                      placeholder="Ví dụ: 500000"
                      value={formData.estimatedBudget}
                      onChange={(e) => handleInputChange("estimatedBudget", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label>Ngày làm việc *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-lg"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: vi }) : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d: Date) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                          modifiers={{
                            workerBusy: (d: Date) => workerBusyYmd.has(format(d, "yyyy-MM-dd")),
                          }}
                          modifiersClassNames={{
                            workerBusy: "bg-primary/15 text-foreground ring-1 ring-primary/25 dark:bg-primary/20",
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {selectedDayHasWorkerBusy ? (
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                        Bạn đang chọn ngày thợ đã có lịch — hãy ưu tiên khung giờ trống hoặc liên hệ thợ.
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <Label htmlFor="timeSlot">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Khung giờ *
                    </Label>
                    <Select
                      value={formData.timeSlot}
                      onValueChange={(value: string) => handleInputChange("timeSlot", value)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Chọn khung giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả chi tiết</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả vấn đề cần sửa chữa..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/40 dark:bg-muted/20 p-4">
                  <h3 className="font-semibold mb-2 text-foreground text-sm">Lưu ý</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Sau khi đặt, kiểm tra mục Đơn hàng và thanh toán cọc nếu hệ thống yêu cầu.</li>
                    <li>Chi phí cuối có thể điều chỉnh sau khi thợ khảo sát.</li>
                    <li>Hủy lịch theo chính sách hiển thị trong ứng dụng.</li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 rounded-xl"
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <motion.div className="flex-1 w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full rounded-xl" disabled={isLoading || !technicianId}>
                    {isLoading ? "Đang tạo booking…" : "Xác nhận đặt lịch"}
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
