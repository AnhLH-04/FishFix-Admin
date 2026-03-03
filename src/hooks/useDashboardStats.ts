import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi, workerApi, reviewApi } from "../services/api";

/**
 * Helper: cố gắng normalize response dạng:
 * - array
 * - { items: [] }
 * - { data: [] }
 * - { result: [] }
 */
function asArray(payload: any): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.result)) return payload.result;
  return [];
}

type RatingsDist = Record<1 | 2 | 3 | 4 | 5, number>;

function emptyRatings(): RatingsDist {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
}

function pickWorkerId(worker: any): string | null {
  // tùy backend trả field gì: workerId / id
  return worker?.workerId ?? worker?.id ?? null;
}

function pickRatingValue(review: any): number | null {
  // tùy backend trả field gì: rating / stars / score...
  const v = review?.rating ?? review?.stars ?? review?.score;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < 1 || n > 5) return null;
  return n;
}

export function useDashboardStats(options?: {
  /**
   * Nếu true: sẽ aggregate reviews theo worker (nhiều request).
   * Nếu false/undefined: ratings sẽ trả về null (bạn có thể dùng mock).
   */
  aggregateRatings?: boolean;

  /**
   * Giới hạn số worker để tránh quá nhiều request (mặc định 30).
   */
  maxWorkersForRatings?: number;
}) {
  const aggregateRatings = options?.aggregateRatings ?? false;
  const maxWorkersForRatings = options?.maxWorkersForRatings ?? 30;

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [ratings, setRatings] = useState<RatingsDist | null>(aggregateRatings ? emptyRatings() : null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Users count
      const usersPayload = await adminApi.getUsers();
      const users = asArray(usersPayload);
      setTotalUsers(users.length);

      // 2) Orders count (Bookings) - IMPORTANT: KHÔNG truyền status="All"
      // Nếu muốn filter, hãy truyền đúng giá trị backend yêu cầu.
      const bookingsPayload = await adminApi.getAdminBookings();
      const bookings = asArray(bookingsPayload);
      setTotalOrders(bookings.length);

      // 3) Ratings (optional aggregation)
      if (aggregateRatings) {
        const workersPayload = await workerApi.getWorkers();
        const workers = asArray(workersPayload);

        const limitedWorkers = workers.slice(0, maxWorkersForRatings);
        const dist: RatingsDist = emptyRatings();

        // gọi reviews theo worker (Promise.all)
        const reviewLists = await Promise.all(
          limitedWorkers.map(async (w) => {
            const workerId = pickWorkerId(w);
            if (!workerId) return [];
            try {
              const reviewsPayload = await reviewApi.getWorkerReviews(workerId);
              return asArray(reviewsPayload);
            } catch {
              return [];
            }
          }),
        );

        for (const list of reviewLists) {
          for (const r of list) {
            const rv = pickRatingValue(r);
            if (!rv) continue;
            dist[rv as 1 | 2 | 3 | 4 | 5] += 1;
          }
        }

        setRatings(dist);
      } else {
        setRatings(null);
      }
    } catch (e: any) {
      // axios interceptor đã xử lý 401 redirect; ở đây chỉ show message
      setError(e?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }, [aggregateRatings, maxWorkersForRatings]);

  useEffect(() => {
    load();
  }, [load]);

  return useMemo(
    () => ({
      totalUsers,
      totalOrders,
      ratings, // có thể null nếu bạn không bật aggregateRatings
      loading,
      error,
      reload: load,
    }),
    [totalUsers, totalOrders, ratings, loading, error, load],
  );
}
