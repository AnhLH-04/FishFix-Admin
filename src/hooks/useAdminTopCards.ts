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
import { adminApi, identityApi, workerApi, BookingItem, UserItem } from "../services/api";

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDayLocal(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDayLocalExclusive(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
}

/**
 * Đếm user tạo trong hôm nay theo LOCAL TIME (VN)
 * Backend trả createdAt dạng ISO UTC (có Z) => new Date(createdAt) tự convert về local
 */
function countNewUsersToday(users: UserItem[]) {
  const now = new Date();
  const start = startOfDayLocal(now).getTime();
  const end = endOfDayLocalExclusive(now).getTime();

  return (users ?? []).filter((u) => {
    if (!u?.createdAt) return false;
    const t = new Date(u.createdAt).getTime();
    return Number.isFinite(t) && t >= start && t < end;
  }).length;
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
      const today = new Date();

      // ===== 7 ngày gần nhất (local) =====
      const from7 = new Date(today);
      from7.setDate(today.getDate() - 6);

      // NOTE quan trọng:
      // Nhiều backend filter theo khoảng [from, to) hoặc cần scheduledTo > scheduledFrom
      // => để chắc chắn "tính đủ hôm nay", scheduledTo nên là NGÀY MAI.
      const scheduledFrom7 = toYmd(from7);
      const scheduledTo7Exclusive = toYmd(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

      // ===== hôm nay (local) =====
      const todayFrom = toYmd(today);
      const todayToExclusive = toYmd(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

      const [bookings7d, bookingsToday, workers, users] = await Promise.all([
        // bookings 7 ngày để tính revenue
        adminApi.getAdminBookings({ scheduledFrom: scheduledFrom7, scheduledTo: scheduledTo7Exclusive }),
        // bookings hôm nay để tính ordersToday (từ hôm nay đến ngày mai)
        adminApi.getAdminBookings({ scheduledFrom: todayFrom, scheduledTo: todayToExclusive }),
        // workers list
        workerApi.getWorkers(),
        // users list
        identityApi.getUsers(),
      ]);

      // ===== Revenue 7d =====
      const revenue7d = (bookings7d ?? []).reduce((sum: number, b: BookingItem) => {
        const v = typeof b.finalAmount === "number" ? b.finalAmount : typeof b.amount === "number" ? b.amount : 0;
        return sum + (Number.isFinite(v) ? v : 0);
      }, 0);

      // ===== Orders Today =====
      const ordersToday = (bookingsToday ?? []).length;

      // ===== Active Workers =====
      // Nếu backend có availabilityStatus thì lọc theo status phù hợp
      const activeWorkers = (workers ?? []).length;

      // ===== New Users Today (local timezone) =====
      const newUsersToday = countNewUsersToday(users ?? []);

      setData({ revenue7d, ordersToday, activeWorkers, newUsersToday });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Fetch dashboard top cards failed");
      // giữ data cũ để không nhảy 0
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, reload: load };
}
