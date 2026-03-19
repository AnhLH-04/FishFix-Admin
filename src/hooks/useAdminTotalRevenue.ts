import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../services/api";

export type RevenueTimeFilter = "week" | "month" | "year";

type BookingLike = {
  status?: string | null;
  finalAmount?: number | null;
  amount?: number | null;
  scheduledDate?: string | null;
  scheduledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
};

function asArray<T = any>(payload: any): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function safeTime(s?: string | null) {
  if (!s) return NaN;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : NaN;
}

/** Thời điểm thanh toán (giống AdminPayments): ưu tiên updatedAt, completedAt, actualEndTime, ... */
function pickPaymentTime(b: BookingLike): number {
  const candidates = [
    b.updatedAt,
    b.completedAt,
    b.actualEndTime,
    b.actualStartTime,
    b.scheduledAt,
    b.scheduledDate,
    b.createdAt,
  ];
  for (const c of candidates) {
    const t = safeTime(c);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

function getBookingAmount(b: BookingLike) {
  const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;
  return Number.isFinite(v) ? v : 0;
}

/** Chỉ tính đơn đã thanh toán — status === "paid" (giống AdminPayments) */
function isPaidRevenueBooking(b: BookingLike): boolean {
  const s = String(b.status ?? "").trim().toLowerCase();
  return s === "paid";
}

function sumInRange(bookings: BookingLike[], fromMs: number, toMsExclusive: number): number {
  return bookings.reduce((sum, b) => {
    if (!isPaidRevenueBooking(b)) return sum;
    const t = pickPaymentTime(b);
    if (!Number.isFinite(t) || t < fromMs || t >= toMsExclusive) return sum;
    return sum + getBookingAmount(b);
  }, 0);
}

export type AdminTotalRevenue = {
  totalRevenue: number;
  revenuePrev: number;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useAdminTotalRevenue(timeFilter: RevenueTimeFilter = "week"): AdminTotalRevenue {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenuePrev, setRevenuePrev] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const today = startOfDay(new Date());
      const toMsExclusive = addDays(today, 1).getTime();

      let rangeFrom: Date;
      let prevFrom: Date;
      let prevToExclusive: number;

      if (timeFilter === "week") {
        rangeFrom = addDays(today, -6);
        prevFrom = addDays(today, -13);
        prevToExclusive = addDays(today, -6).getTime();
      } else if (timeFilter === "month") {
        rangeFrom = addDays(today, -29);
        prevFrom = addDays(today, -59);
        prevToExclusive = addDays(today, -29).getTime();
      } else {
        // year: 12 tháng (từ đầu tháng 12 tháng trước đến hôm nay)
        rangeFrom = startOfMonth(addMonths(today, -11));
        const prevRangeEnd = addDays(rangeFrom, -1);
        prevFrom = startOfMonth(addMonths(prevRangeEnd, -11));
        prevToExclusive = rangeFrom.getTime();
      }

      const rangeFromMs = rangeFrom.getTime();

      const totalBookingsPayload = await adminApi.getAdminBookings().catch(() => null);
      const totalBookings = asArray<BookingLike>(totalBookingsPayload);

      const currentSum = sumInRange(totalBookings, rangeFromMs, toMsExclusive);
      const prevSum = sumInRange(totalBookings, prevFrom.getTime(), prevToExclusive);

      setTotalRevenue(Number.isFinite(currentSum) ? currentSum : 0);
      setRevenuePrev(Number.isFinite(prevSum) ? prevSum : 0);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load total revenue");
      setTotalRevenue(0);
      setRevenuePrev(0);
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    totalRevenue,
    revenuePrev,
    loading,
    error,
    reload: () => void load(),
  };
}
