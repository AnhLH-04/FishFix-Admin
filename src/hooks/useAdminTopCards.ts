// import { useCallback, useEffect, useMemo, useState } from "react";
// import { adminApi, identityApi, workerApi, BookingItem, UserItem, WorkerItem } from "../services/api";

// function toYmd(d: Date) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// function startOfDay(d: Date) {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
// }

// export type AdminTopCards = {
//   revenue7d: number;
//   ordersToday: number;
//   activeWorkers: number;
//   newUsersToday: number;
// };

// export function useAdminTopCards() {
//   const [data, setData] = useState<AdminTopCards>({
//     revenue7d: 0,
//     ordersToday: 0,
//     activeWorkers: 0,
//     newUsersToday: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const today = new Date();
//       const from7 = new Date();
//       from7.setDate(today.getDate() - 6);

//       const scheduledFrom = toYmd(from7);
//       const scheduledTo = toYmd(today);
//       const todayYmd = toYmd(today);

//       // 1) bookings 7 ngày để tính revenue
//       // 2) bookings hôm nay để tính ordersToday
//       // 3) workers list
//       // 4) users list
//       const [bookings7d, bookingsToday, workers, users] = await Promise.all([
//         adminApi.getAdminBookings({ scheduledFrom, scheduledTo }), // KHÔNG truyền status="All"
//         adminApi.getAdminBookings({ scheduledFrom: todayYmd, scheduledTo: todayYmd }),
//         workerApi.getWorkers(),
//         identityApi.getUsers(),
//       ]);

//       // ===== Revenue 7d =====
//       const revenue7d = (bookings7d ?? []).reduce((sum: number, b: BookingItem) => {
//         const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;
//         return sum + (Number.isFinite(v) ? v : 0);
//       }, 0);

//       // ===== Orders Today =====
//       const ordersToday = (bookingsToday ?? []).length;

//       // ===== Active Workers =====
//       // Nếu backend có availabilityStatus thì bạn có thể lọc:
//       // const activeWorkers = workers.filter(w => w.availabilityStatus === "Available").length
//       const activeWorkers = (workers ?? []).length;

//       // ===== New Users Today =====
//       // Swagger không có filter theo ngày, nên chỉ làm được nếu API trả createdAt
//       const sod = startOfDay(today).getTime();
//       const newUsersToday = (users ?? []).filter((u: UserItem) => {
//         if (!u.createdAt) return false;
//         const t = new Date(u.createdAt).getTime();
//         return Number.isFinite(t) && t >= sod;
//       }).length;

//       setData({ revenue7d, ordersToday, activeWorkers, newUsersToday });
//     } catch (e: any) {
//       setError(e?.response?.data?.message || e?.message || "Fetch dashboard top cards failed");
//       // nếu lỗi thì vẫn giữ data cũ, không set 0 để tránh nhảy số
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   return { ...data, loading, error, reload: load };
// }
import { useCallback, useEffect, useState } from "react";
import { adminApi, identityApi, workerApi } from "../services/api";

type BookingLike = {
  bookingId?: string;
  id?: string;
  status?: string | number | null;
  amount?: number;
  finalAmount?: number;
  scheduledDate?: string;
  scheduledAt?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
};

function asArray<T = any>(payload: unknown): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as T[];

  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.result)) return obj.result as T[];
  }

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

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function safeTime(s?: string) {
  if (!s) return NaN;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : NaN;
}

function pickBookingTime(b: BookingLike): number {
  const candidates = [b.scheduledDate, b.scheduledAt, b.completedAt, b.createdAt, b.updatedAt];
  for (const c of candidates) {
    const t = safeTime(c);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

/** Thời điểm thanh toán/hoàn thành (ưu tiên updatedAt, completedAt, actualEndTime, ...) */
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

function isPaidBooking(b: BookingLike): boolean {
  const s = String(b.status ?? "").trim().toLowerCase();
  return s === "paid";
}

function isCompletedBooking(b: BookingLike) {
  if (b.completedAt) return true;

  const st = b.status;
  if (typeof st === "string") {
    const s = st.toLowerCase();
    return (
      // Treat paid bookings as completed for revenue/order KPIs
      s.includes("paid") ||
      s.includes("complete") ||
      s.includes("completed") ||
      s.includes("done") ||
      s.includes("finish") ||
      s.includes("success")
    );
  }

  if (typeof st === "number") return st >= 3;
  return false;
}

function getBookingAmount(b: BookingLike) {
  const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;

  return Number.isFinite(v) ? v : 0;
}

function isSameDay(ms: number, day: Date) {
  const d = new Date(ms);
  return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
}

export type AdminTopCards = {
  revenue7d: number;
  ordersToday: number;
  activeWorkers: number;
  newUsersToday: number;
};

export function useAdminTopCards() {
  const [data, setData] = useState<AdminTopCards>({
    revenue7d: 0,
    ordersToday: 0,
    activeWorkers: 0,
    newUsersToday: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const today = startOfDay(new Date());
      const from7 = addDays(today, -6);
      const from7Ms = from7.getTime();
      const toMsExclusive = addDays(today, 1).getTime();
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      const [bookingsRes, workersRes, usersRes] = await Promise.all([
        adminApi.getAdminBookings().catch(() => []),
        workerApi.getWorkers(),
        identityApi.getUsers(),
      ]);

      const allBookings = asArray<BookingLike>(bookingsRes);
      const workers = asArray<any>(workersRes);
      const users = asArray<any>(usersRes);

      const bookings = allBookings.filter((b) => {
        const t = b.scheduledDate ? safeTime(b.scheduledDate) : pickBookingTime(b);
        return Number.isFinite(t) && t >= from7Ms && t < toMsExclusive;
      });

      const completed7d = bookings.filter((b) => {
        const t = pickBookingTime(b);
        return Number.isFinite(t) && t >= from7Ms && isCompletedBooking(b);
      });

      const revenue7d = completed7d.reduce((sum, b) => sum + getBookingAmount(b), 0);

      // Đơn hàng gần đây: cùng logic với list "Đơn Hàng Gần Đây" — pickBookingTime trong 7 ngày gần đây
      const ordersToday = allBookings.filter(
        (b) => Number.isFinite(pickBookingTime(b)) && pickBookingTime(b) >= sevenDaysAgo,
      ).length;

      const activeWorkers = workers.length;

      const newUsersToday = users.filter((u) => {
        const t = safeTime(u?.createdAt);
        return Number.isFinite(t) && isSameDay(t, today);
      }).length;

      setData({
        revenue7d: Number.isFinite(revenue7d) ? revenue7d : 0,
        ordersToday,
        activeWorkers,
        newUsersToday,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Fetch dashboard top cards failed");
    } finally {
      setLoading(false);
    }
  }, []);
  //...
  useEffect(() => {
    load();
  }, [load]);

  return {
    ...data,
    loading,
    error,
    reload: load,
  };
}
