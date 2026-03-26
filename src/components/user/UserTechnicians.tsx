import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Search, MapPin, Star, Briefcase, MessageSquare, Phone, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import type { CategoryItem } from '../../services/api';
import { workerApi, categoryApi } from '../../services/api';
import { getWorkerReviews } from '../../services/workerService';
import { toast } from 'sonner';
import { cn } from '../ui/utils';
import type { ServiceCategoryId } from './serviceData';

/** Fallback slug → id khi /api/categories chưa khớp hoặc chưa tải */
const SERVICE_SLUG_FALLBACK_CATEGORY_ID: Partial<Record<ServiceCategoryId, number>> = {
  electric: 1,
  plumbing: 2,
  hvac: 3,
  painting: 4,
  electronics: 5,
  vehicle: 6,
  woodwork: 7,
  cleaning: 8,
};

/** Fallback tên danh mục theo id */
const CATEGORY_ID_LABEL: Record<number, string> = {
  1: 'Điện',
  2: 'Nước',
  3: 'Điều hòa',
  4: 'Sơn',
  5: 'Điện tử',
  6: 'Xe',
  7: 'Mộc',
  8: 'Vệ sinh',
};

function inferSlugFromCategoryName(c: CategoryItem): ServiceCategoryId | null {
  const n = String(c.name ?? c.title ?? '').toLowerCase();
  if (n.includes('máy lạnh') || n.includes('điều hòa') || n.includes('điện lạnh')) return 'hvac';
  if (n.includes('điện tử')) return 'electronics';
  if (n.includes('mộc') || n.includes('gỗ')) return 'woodwork';
  if (n.includes('nước') || n.includes('ống') || n.includes('cống')) return 'plumbing';
  if (n.includes('sơn')) return 'painting';
  if (n.includes('xe máy') || (n.includes('xe') && !n.includes('máy lạnh'))) return 'vehicle';
  if (n.includes('vệ sinh')) return 'cleaning';
  if (n.includes('điện')) return 'electric';
  return null;
}

function categoryIdsForServiceSlug(slug: string, categories: CategoryItem[]): number[] {
  if (!slug) return [];
  const ids = categories
    .filter((c) => inferSlugFromCategoryName(c) === slug)
    .map((c) => Number(c.categoryId ?? c.id))
    .filter((id) => Number.isFinite(id));
  return [...new Set(ids)];
}

const serviceCategories: Record<ServiceCategoryId, string> = {
  electric: 'Điện',
  plumbing: 'Nước',
  hvac: 'Điều hòa',
  painting: 'Sơn',
  electronics: 'Điện tử',
  woodwork: 'Mộc',
  vehicle: 'Xe',
  cleaning: 'Vệ sinh',
};

type WorkerSkill = {
  skillId?: string;
  categoryId?: number;
  yearsOfExperience?: number;
  isPrimarySkill?: boolean;
};

export type PublicDispatchWorker = {
  workerId: string;
  userId?: string;
  fullName: string | null;
  phone: string | null;
  bio: string | null;
  hourlyRate: number | null;
  ratingAvg: number;
  ratingCount: number;
  completedJobs: number;
  availabilityStatus: string;
  workingRadiusKm?: number;
  isVerified: boolean;
  skills?: WorkerSkill[];
};

function normalizeWorkersPayload(data: unknown): PublicDispatchWorker[] {
  const raw = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.result)) return o.result;
    return [];
  })() as Record<string, unknown>[];

  const out: PublicDispatchWorker[] = [];
  for (const w of raw) {
    const workerId = String(w.workerId ?? w.id ?? '');
    if (!workerId) continue;
    out.push({
      workerId,
      userId: w.userId != null ? String(w.userId) : undefined,
      fullName: (w.fullName as string | null) ?? null,
      phone: (w.phone as string | null) ?? null,
      bio: (w.bio as string | null) ?? null,
      hourlyRate: typeof w.hourlyRate === "number" ? w.hourlyRate : w.hourlyRate != null ? Number(w.hourlyRate) : null,
      ratingAvg: Number(w.ratingAvg ?? 0),
      ratingCount: Number(w.ratingCount ?? 0),
      completedJobs: Number(w.completedJobs ?? 0),
      availabilityStatus: String(w.availabilityStatus ?? "unknown"),
      workingRadiusKm: typeof w.workingRadiusKm === "number" ? w.workingRadiusKm : undefined,
      isVerified: Boolean(w.isVerified),
      skills: Array.isArray(w.skills) ? (w.skills as WorkerSkill[]) : [],
    });
  }
  return out;
}

function initialsFromName(name: string | null | undefined): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Giống AdminTechnicians — parse response GET /api/workers/{id}/reviews */
function computeRatingFromReviewsResponse(data: unknown): { avg: number; count: number } {
  const list: unknown[] = Array.isArray(data)
    ? data
    : data && typeof data === 'object'
      ? (Array.isArray((data as { items?: unknown[] }).items)
          ? (data as { items: unknown[] }).items
          : Array.isArray((data as { data?: unknown[] }).data)
            ? (data as { data: unknown[] }).data
            : [])
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

async function hydrateRatingsFromReviews(workers: PublicDispatchWorker[]): Promise<PublicDispatchWorker[]> {
  return Promise.all(
    workers.map(async (w) => {
      try {
        const data = await getWorkerReviews(w.workerId);
        const { avg, count } = computeRatingFromReviewsResponse(data);
        return { ...w, ratingAvg: avg, ratingCount: count };
      } catch {
        return w;
      }
    }),
  );
}

function RatingStars({ value, className }: { value: number; className?: string }) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(v);
        return (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5 shrink-0 transition-colors',
              filled ? 'fill-amber-400 text-amber-500' : 'fill-transparent text-gray-300 dark:text-gray-600',
            )}
          />
        );
      })}
    </div>
  );
}

const listContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 28 },
  },
};

function TechniciansSkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md dark:bg-gray-900/40">
          <CardHeader className="flex flex-row gap-4">
            <Skeleton className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function UserTechnicians() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceFilter = searchParams.get('service') || '';
  const categoryIdFromUrl = searchParams.get('categoryId');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(serviceFilter);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(() => {
    const n = categoryIdFromUrl ? Number(categoryIdFromUrl) : NaN;
    return Number.isFinite(n) ? n : null;
  });
  const [sortBy, setSortBy] = useState('rating');
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const [workers, setWorkers] = useState<PublicDispatchWorker[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedService(serviceFilter);
  }, [serviceFilter]);

  useEffect(() => {
    const n = categoryIdFromUrl ? Number(categoryIdFromUrl) : NaN;
    setSelectedCategoryId(Number.isFinite(n) ? n : null);
  }, [categoryIdFromUrl]);

  const loadWorkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [raw, cats] = await Promise.all([
        (async () => {
          try {
            return await workerApi.getWorkers(verifiedOnly ? { isVerified: true } : undefined);
          } catch {
            if (verifiedOnly) return await workerApi.getWorkers();
            throw new Error('Không tải được danh sách thợ');
          }
        })(),
        categoryApi.getCategories({ activeOnly: true }).catch(() => categoryApi.getCategories()),
      ]);
      const normalized = normalizeWorkersPayload(raw);
      const withReviewRatings = await hydrateRatingsFromReviews(normalized);
      setWorkers(withReviewRatings);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Không thể tải danh sách thợ';
      setError(message);
      setWorkers([]);
      setCategories([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [verifiedOnly]);

  useEffect(() => {
    void loadWorkers();
  }, [loadWorkers]);

  const labelForCategoryId = useCallback(
    (categoryId: number) => {
      const c = categories.find((x) => Number(x.categoryId ?? x.id) === categoryId);
      return String(c?.name ?? c?.title ?? CATEGORY_ID_LABEL[categoryId] ?? `Danh mục ${categoryId}`);
    },
    [categories],
  );

  const filterCategoryIds = useMemo(() => {
    if (selectedCategoryId != null && Number.isFinite(selectedCategoryId)) {
      const childIds = categories
        .filter((c) => {
          const pid = c.parentId;
          return pid != null && Number(pid) === selectedCategoryId;
        })
        .map((c) => Number(c.categoryId ?? c.id))
        .filter((id) => Number.isFinite(id));
      return [...new Set([selectedCategoryId, ...childIds])];
    }
    if (!selectedService) return [] as number[];
    const fromApi = categoryIdsForServiceSlug(selectedService, categories);
    if (fromApi.length) return fromApi;
    const fb = SERVICE_SLUG_FALLBACK_CATEGORY_ID[selectedService as ServiceCategoryId];
    return typeof fb === 'number' ? [fb] : [];
  }, [selectedCategoryId, selectedService, categories]);

  const activeCategoryLabel = useMemo(() => {
    if (selectedCategoryId == null) return null;
    const c = categories.find((x) => Number(x.categoryId ?? x.id) === selectedCategoryId);
    return String(c?.name ?? c?.title ?? CATEGORY_ID_LABEL[selectedCategoryId] ?? `Danh mục #${selectedCategoryId}`);
  }, [selectedCategoryId, categories]);

  const filteredTechnicians = useMemo(() => {
    return workers
      .filter((w) => {
        const name = w.fullName ?? '';
        const bio = w.bio ?? '';
        const phone = w.phone ?? '';
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          name.toLowerCase().includes(q) ||
          bio.toLowerCase().includes(q) ||
          phone.includes(searchTerm);
        const matchesService =
          filterCategoryIds.length === 0 ||
          (w.skills ?? []).some((s) => s.categoryId != null && filterCategoryIds.includes(s.categoryId));
        return matchesSearch && matchesService;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          if (b.ratingAvg !== a.ratingAvg) return b.ratingAvg - a.ratingAvg;
          return b.ratingCount - a.ratingCount;
        }
        if (sortBy === 'jobs') return b.completedJobs - a.completedJobs;
        const pa = a.hourlyRate ?? 0;
        const pb = b.hourlyRate ?? 0;
        if (sortBy === 'price-low') return pa - pb;
        if (sortBy === 'price-high') return pb - pa;
        return 0;
      });
  }, [workers, searchTerm, filterCategoryIds, sortBy]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="bg-linear-to-r from-[#007BFF] to-blue-600 dark:from-blue-700 dark:to-indigo-800 text-white py-12 md:py-14">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Thợ sửa chuyên nghiệp</h1>
            <p className="text-blue-50/95 text-base md:text-lg max-w-2xl">
              Danh sách thợ từ FishFix — lọc theo dịch vụ, đặt lịch nhanh.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm thợ theo tên, SĐT, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 dark:border-gray-700 dark:bg-gray-900/60 focus-visible:ring-blue-500"
              />
            </div>
            <Select
              value={selectedService || 'all'}
              onValueChange={(v: string) => {
                setSelectedService(v === 'all' ? '' : v);
                setSelectedCategoryId(null);
                const next = new URLSearchParams(searchParams);
                next.delete('categoryId');
                setSearchParams(next, { replace: true });
              }}
            >
              <SelectTrigger className="w-full md:w-64 border-2 dark:border-gray-700 dark:bg-gray-900/60">
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                {(Object.entries(serviceCategories) as [ServiceCategoryId, string][]).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-64 border-2 dark:border-gray-700 dark:bg-gray-900/60">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="jobs">Nhiều công việc nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 px-4 py-3 backdrop-blur-sm">
            <Switch id="verified-only" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
            <Label htmlFor="verified-only" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Chỉ hiển thị thợ đã xác minh
            </Label>
          </div>

          {activeCategoryLabel && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/90 dark:bg-blue-950/35 px-4 py-3"
            >
              <span className="text-sm text-gray-700 dark:text-gray-200">Lọc theo danh mục:</span>
              <Badge className="border-0 bg-linear-to-r from-[#007BFF] to-blue-600 text-white">{activeCategoryLabel}</Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-blue-700 dark:text-blue-300"
                onClick={() => {
                  setSelectedCategoryId(null);
                  const next = new URLSearchParams(searchParams);
                  next.delete('categoryId');
                  setSearchParams(next, { replace: true });
                }}
              >
                Bỏ lọc
              </Button>
            </motion.div>
          )}
        </motion.div>

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-4 text-red-800 dark:text-red-200"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Không tải được danh sách thợ</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadWorkers()} className="shrink-0 border-red-300 dark:border-red-800">
              Thử lại
            </Button>
          </motion.div>
        )}

        {loading ? (
          <TechniciansSkeletonGrid />
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={listContainer}
            initial="hidden"
            animate="show"
          >
            {filteredTechnicians.map((tech) => {
              const displayName = tech.fullName?.trim() || 'Thợ FishFix';
              const available = tech.availabilityStatus === 'available';
              const rate = tech.hourlyRate != null && tech.hourlyRate > 0 ? `${tech.hourlyRate.toLocaleString('vi-VN')}đ/giờ` : 'Liên hệ — thỏa thuận';

              return (
                <motion.div key={tech.workerId} variants={cardItem} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
                  <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl dark:bg-gray-900/40 hover:border-blue-300/60 dark:hover:border-blue-600/40 transition-colors duration-300 overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 ring-2 ring-[#007BFF]/25 dark:ring-blue-400/30">
                          <AvatarImage src="" alt="" />
                          <AvatarFallback className="bg-linear-to-br from-[#007BFF] to-blue-600 text-white font-semibold">
                            {initialsFromName(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="flex flex-wrap items-center gap-2 text-gray-900 dark:text-white">
                            <span className="truncate">{displayName}</span>
                            {tech.isVerified && (
                              <Badge className="text-xs bg-linear-to-r from-[#007BFF] to-blue-600 text-white border-0">Đã xác minh</Badge>
                            )}
                          </CardTitle>
                          <motion.div
                            className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-gray-700 dark:text-gray-300"
                            initial={{ opacity: 0.85 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.35 }}
                          >
                            <RatingStars value={tech.ratingAvg} />
                            <span className="font-semibold tabular-nums">{tech.ratingAvg.toFixed(1)}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({tech.ratingCount} đánh giá)
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="min-h-[48px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {tech.bio?.trim() || 'Chưa có giới thiệu.'}
                      </CardDescription>

                      <div className="flex flex-wrap gap-1">
                        {(tech.skills ?? []).map((skill, si) => (
                          <Badge
                            key={skill.skillId ?? `${tech.workerId}-sk-${skill.categoryId ?? si}`}
                            variant="outline"
                            className="border-[#007BFF]/30 dark:border-blue-700 text-[#007BFF] dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/30"
                          >
                            {skill.categoryId != null ? labelForCategoryId(skill.categoryId) : 'Kỹ năng'}
                            {skill.yearsOfExperience != null ? ` · ${skill.yearsOfExperience} năm` : ''}
                          </Badge>
                        ))}
                        {(!tech.skills || tech.skills.length === 0) && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Chưa khai báo kỹ năng</span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#007BFF] dark:text-blue-400 shrink-0" />
                          <span>Bán kính ~{tech.workingRadiusKm ?? 10} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-[#007BFF] dark:text-blue-400 shrink-0" />
                          <span>{tech.completedJobs} công việc hoàn thành</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-[#007BFF] dark:text-blue-400">{rate}</div>
                      </div>

                      {available ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">Đang rảnh</Badge>
                      ) : (
                        <Badge variant="secondary" className="dark:bg-gray-700">
                          {tech.availabilityStatus === 'busy' ? 'Đang bận' : 'Ngoại tuyến'}
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <Link to={`/booking?technicianId=${tech.workerId}`} className="flex-1 min-w-[120px]">
                        <Button className="w-full bg-linear-to-r from-[#007BFF] to-blue-600 hover:opacity-95 text-white shadow-md" disabled={!available}>
                          Đặt lịch
                        </Button>
                      </Link>
                      {tech.phone && (
                        <Button variant="outline" size="icon" asChild className="border-2 dark:border-gray-600 shrink-0" title="Gọi điện">
                          <a href={`tel:${tech.phone.replace(/\s/g, '')}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="icon" className="border-2 dark:border-gray-600 shrink-0" type="button" title="Nhắn tin (sắp ra mắt)" disabled>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && !error && filteredTechnicians.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/30"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">Không tìm thấy thợ phù hợp</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Thử bỏ bộ lọc hoặc từ khóa tìm kiếm</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
