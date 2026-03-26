import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, MessageSquareText, UserRound, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../ui/utils";

import { getAllWorkers, getWorkerReviews, type WorkerProfile, type WorkerReview } from "../../services/workerService";

function normalizeReviewsPayload(data: unknown): WorkerReview[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as WorkerReview[];
  if (typeof data === "object" && data !== null) {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.items)) return o.items as WorkerReview[];
    if (Array.isArray(o.data)) return o.data as WorkerReview[];
    if (Array.isArray(o.result)) return o.result as WorkerReview[];
  }
  return [];
}

/** Giống AdminTechnicians — tính avg/count từ GET /api/workers/{id}/reviews */
function computeRatingFromReviewsResponse(data: unknown): { avg: number; count: number } {
  const list: unknown[] = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? Array.isArray((data as { items?: unknown[] }).items)
        ? (data as { items: unknown[] }).items
        : Array.isArray((data as { data?: unknown[] }).data)
          ? (data as { data: unknown[] }).data
          : Array.isArray((data as { result?: unknown[] }).result)
            ? (data as { result: unknown[] }).result
            : []
      : [];

  const count = list.length;
  const sum = list.reduce((acc: number, r) => {
    const o = r as Record<string, unknown>;
    const rating = Number(o?.rating ?? o?.stars ?? o?.score ?? 0) || 0;
    return acc + rating;
  }, 0);
  const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  return { avg, count };
}

function reviewerDisplayName(r: WorkerReview): string {
  const n =
    r.customerName ??
    r.fullName ??
    r.userName ??
    (r.email ? String(r.email).split("@")[0] : undefined) ??
    (r.phone ? String(r.phone) : undefined);
  if (n && String(n).trim()) return String(n).trim();
  if (r.customerId != null) return `Khách #${r.customerId}`;
  return "Người dùng";
}

function reviewRating(r: WorkerReview): number {
  const v = Number(r.rating ?? 0);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(5, v));
}

function formatReviewDate(r: WorkerReview): string {
  const raw = r.createdAt ?? r.updatedAt;
  if (!raw) return "";
  try {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(raw);
  }
}

function initials(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  const p = t.split(/\s+/);
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28 },
  },
};

function StarRow({ value, className }: { value: number; className?: string }) {
  const v = Number.isFinite(value) ? Math.round(value * 2) / 2 : 0;
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${v} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 shrink-0",
            i <= v ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600",
          )}
        />
      ))}
    </div>
  );
}

export function AdminReview() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<WorkerReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [search, setSearch] = useState("");

  const selectedWorker = useMemo(() => workers.find((w) => w.workerId === selectedId) ?? null, [workers, selectedId]);

  /** Giống AdminTechnicians: gọi review API từng thợ để cập nhật ratingAvg / ratingCount */
  const hydrateRatings = useCallback(async (workerList: WorkerProfile[]) => {
    const updated = await Promise.all(
      workerList.map(async (w) => {
        try {
          const data = await getWorkerReviews(w.workerId);
          const { avg, count } = computeRatingFromReviewsResponse(data);
          return { ...w, ratingAvg: avg, ratingCount: count } as WorkerProfile;
        } catch {
          return w;
        }
      }),
    );
    setWorkers(updated);
  }, []);

  const loadWorkers = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (opts?.silent) setRefreshing(true);
      else setLoadingWorkers(true);
      try {
        const list = await getAllWorkers(true);
        const activeList = (list ?? []) as WorkerProfile[];

        setSelectedId((prev) => {
          if (prev && activeList.some((w) => w.workerId === prev)) return prev;
          return activeList[0]?.workerId ?? null;
        });

        setWorkers(activeList);
        await hydrateRatings(activeList);
      } catch (e) {
        console.error(e);
        toast.error("Không tải được danh sách thợ");
      } finally {
        setLoadingWorkers(false);
        setRefreshing(false);
      }
    },
    [hydrateRatings],
  );

  useEffect(() => {
    void loadWorkers();
  }, [loadWorkers]);

  useEffect(() => {
    if (!selectedId) {
      setReviews([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingReviews(true);
      try {
        const raw = await getWorkerReviews(selectedId);
        if (!cancelled) setReviews(normalizeReviewsPayload(raw));
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setReviews([]);
          toast.error("Không tải được đánh giá cho thợ này");
        }
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const filteredWorkers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter(
      (w) =>
        (w.fullName || "").toLowerCase().includes(q) ||
        (w.phone || "").includes(search.trim()) ||
        (w.bio || "").toLowerCase().includes(q),
    );
  }, [workers, search]);

  const stats = useMemo(() => {
    const totalReviews = workers.reduce((acc, w) => acc + (Number(w.ratingCount) || 0), 0);
    const weighted = workers.reduce((acc, w) => acc + (Number(w.ratingAvg) || 0) * (Number(w.ratingCount) || 0), 0);
    const avgPlatform = totalReviews > 0 ? Math.round((weighted / totalReviews) * 10) / 10 : 0;
    return { totalReviews, avgPlatform, workerCount: workers.length };
  }, [workers]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const ta = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
      const tb = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
      return tb - ta;
    });
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Header — spotlight-style gradient theo palette FishFix admin */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-linear-to-br from-[#007BFF]/25 via-purple-500/15 to-transparent blur-2xl dark:from-[#007BFF]/20"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="h-4 w-4 text-[#007BFF]" />
              <span>Quản trị · Phản hồi khách hàng</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 md:text-3xl">
              Đánh giá theo thợ
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-blue-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              disabled={refreshing || loadingWorkers}
              onClick={() => void loadWorkers({ silent: true })}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Làm mới
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-linear-to-r from-[#007BFF] to-blue-600 text-white shadow-md hover:opacity-95"
            >
              <Link to="/admin/technicians" className="gap-1">
                Thợ sửa chữa
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Tổng đánh giá",
              value: stats.totalReviews,
              sub: "Ghi nhận trên hệ thống",
              icon: MessageSquareText,
            },
            {
              label: "Điểm TB toàn sàn",
              value: stats.avgPlatform > 0 ? `${stats.avgPlatform} / 5` : "—",
              sub: "Trọng số theo số lượt",
              icon: Star,
            },
            {
              label: "Thợ đang xét",
              value: stats.workerCount,
              sub: "Danh sách đã xác minh",
              icon: UserRound,
            },
          ].map((s, i) => {
            const StatIcon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, type: "spring", stiffness: 300, damping: 26 }}
              >
                <Card className="border-blue-100/60 bg-white/90 dark:border-gray-800 dark:bg-gray-950/60">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
                      <StatIcon className="h-5 w-5 text-[#007BFF]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {s.label}
                      </p>
                      <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{s.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
        {/* Danh sách thợ */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card className="h-full border-blue-100/70 bg-white/90 shadow-md dark:border-gray-800 dark:bg-gray-900/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-gray-50">Chọn thợ</CardTitle>
              <CardDescription className="dark:text-gray-400">Lọc theo tên, SĐT hoặc giới thiệu</CardDescription>
              <div className="relative pt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm thợ..."
                  className="border-gray-200 pl-9 dark:border-gray-700 dark:bg-gray-950"
                />
              </div>
              <div className="pt-2 lg:hidden">
                <Select
                  value={selectedId ?? ""}
                  onValueChange={(v: string) => setSelectedId(v ? v : null)}
                  disabled={loadingWorkers || filteredWorkers.length === 0}
                >
                  <SelectTrigger className="dark:border-gray-700 dark:bg-gray-950">
                    <SelectValue placeholder="Chọn thợ" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredWorkers.map((w) => (
                      <SelectItem key={w.workerId} value={w.workerId}>
                        {w.fullName || "Chưa có tên"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="hidden p-0 pb-4 lg:block">
              {loadingWorkers ? (
                <div className="space-y-3 px-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : filteredWorkers.length === 0 ? (
                <p className="px-6 text-sm text-gray-500 dark:text-gray-400">Không có thợ khớp bộ lọc.</p>
              ) : (
                <ScrollArea className="h-[min(60vh,520px)] px-3">
                  <div className="space-y-2 pr-3">
                    {filteredWorkers.map((w) => {
                      const active = w.workerId === selectedId;
                      return (
                        <motion.button
                          key={w.workerId}
                          type="button"
                          layout
                          onClick={() => setSelectedId(w.workerId)}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                            active
                              ? "border-[#007BFF]/40 bg-linear-to-r from-blue-50/90 to-purple-50/40 shadow-sm dark:from-blue-950/40 dark:to-purple-950/20"
                              : "border-transparent bg-gray-50/80 hover:border-blue-100 hover:bg-white dark:bg-gray-950/50 dark:hover:border-gray-700",
                          )}
                        >
                          <Avatar className="h-10 w-10 border border-white shadow-sm dark:border-gray-800">
                            <AvatarFallback className="bg-linear-to-br from-[#007BFF] to-purple-600 text-xs font-medium text-white">
                              {initials(w.fullName || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                              {w.fullName || "Chưa có tên"}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <StarRow value={Number(w.ratingAvg) || 0} />
                              <span>·</span>
                              <span>{Number(w.ratingCount) || 0} đánh giá</span>
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0 text-gray-300 transition-transform dark:text-gray-600",
                              active && "text-[#007BFF] translate-x-0.5",
                            )}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chi tiết đánh giá */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card className="min-h-[420px] border-blue-100/70 bg-white/90 shadow-md dark:border-gray-800 dark:bg-gray-900/80">
            <CardHeader className="border-b border-blue-50 dark:border-gray-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl dark:text-gray-50">
                    {selectedWorker ? selectedWorker.fullName || "Thợ" : "Chọn một thợ"}
                  </CardTitle>
                  {selectedWorker && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-[#007BFF] dark:bg-blue-950 dark:text-blue-200"
                      >
                        TB {(Number(selectedWorker.ratingAvg) || 0).toFixed(1)} / 5
                      </Badge>
                      <Badge variant="outline" className="dark:border-gray-600">
                        {Number(selectedWorker.ratingCount) || 0} lượt
                      </Badge>
                      <Button asChild variant="ghost" size="sm" className="h-8 text-[#007BFF]">
                        <Link to={`/admin/technicians/${selectedWorker.workerId}`}>Xem hồ sơ thợ</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!selectedWorker ? (
                <p className="p-6 text-sm text-gray-500 dark:text-gray-400">Chưa chọn thợ.</p>
              ) : loadingReviews ? (
                <div className="space-y-4 p-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : sortedReviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-2 py-16 text-center"
                >
                  <MessageSquareText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <p className="font-medium text-gray-700 dark:text-gray-300">Chưa có đánh giá</p>
                  <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                    {`API /api/workers/{workerId}/reviews không trả bản ghi cho thợ này.`}
                  </p>
                </motion.div>
              ) : (
                <ScrollArea className="h-[min(65vh,640px)]">
                  <motion.ul className="space-y-3 p-6" variants={containerVariants} initial="hidden" animate="show">
                    <AnimatePresence mode="popLayout">
                      {sortedReviews.map((r, idx) => (
                        <motion.li
                          key={String(r.id ?? `${idx}-${r.createdAt}`)}
                          variants={itemVariants}
                          layout
                          whileHover={{ y: -2, scale: 1.005 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        >
                          <Card className="border-blue-100/50 bg-linear-to-b from-white to-gray-50/40 dark:border-gray-800 dark:from-gray-950 dark:to-gray-900/60">
                            <CardContent className="p-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <Avatar className="mt-0.5 h-10 w-10 border dark:border-gray-700">
                                    <AvatarFallback className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                      {initials(reviewerDisplayName(r))}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {reviewerDisplayName(r)}
                                    </p>
                                    {formatReviewDate(r) && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatReviewDate(r)}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <StarRow value={reviewRating(r)} />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {reviewRating(r).toFixed(1)} / 5
                                  </span>
                                </div>
                              </div>
                              {r.comment?.trim() ? (
                                <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                  {r.comment.trim()}
                                </p>
                              ) : (
                                <p className="mt-3 text-sm italic text-gray-400 dark:text-gray-500">
                                  (Không có nội dung nhận xét)
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
