// src/components/user/technicianData.ts
import type { ServiceCategoryId } from "./serviceData";

export type Technician = {
  id: string;
  name: string;
  phone?: string;
  rating: number; // 0..5
  jobsDone: number;
  distanceKm: number;
  available: boolean;

  // ✅ đồng bộ theo serviceData
  services: ServiceCategoryId[];

  avatarUrl?: string;
};

// ✅ đồng bộ theo serviceData
export const serviceCategoryLabels: Record<ServiceCategoryId, string> = {
  electric: "Điện",
  plumbing: "Nước",
  hvac: "Điều hòa",
  painting: "Sơn",
  electronics: "Điện tử",
  woodwork: "Mộc",
  vehicle: "Xe",
  cleaning: "Vệ sinh",
};

// ✅ runtime guard (tránh cast bừa rồi lỗi)
export function isServiceCategoryId(value: string): value is ServiceCategoryId {
  return Object.prototype.hasOwnProperty.call(serviceCategoryLabels, value);
}

export const technicians: Technician[] = [
  {
    id: "T001",
    name: "Nguyễn Văn An",
    phone: "0901 111 222",
    rating: 4.8,
    jobsDone: 215,
    distanceKm: 2.1,
    available: true,
    services: ["electric", "electronics"],
    avatarUrl: "https://images.unsplash.com/photo-1520975958225-21c0f7c4c0a2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "T002",
    name: "Trần Minh Khang",
    phone: "0902 333 444",
    rating: 4.6,
    jobsDone: 164,
    distanceKm: 3.7,
    available: false,
    services: ["plumbing", "cleaning"],
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "T003",
    name: "Lê Hải Đăng",
    phone: "0903 555 666",
    rating: 4.9,
    jobsDone: 302,
    distanceKm: 4.4,
    available: true,
    services: ["hvac", "electric"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "T004",
    name: "Phạm Quốc Huy",
    phone: "0904 777 888",
    rating: 4.4,
    jobsDone: 98,
    distanceKm: 1.9,
    available: true,
    services: ["woodwork", "painting"],
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "T005",
    name: "Vũ Thành Long",
    phone: "0905 999 000",
    rating: 4.7,
    jobsDone: 187,
    distanceKm: 6.2,
    available: false,
    services: ["plumbing", "hvac", "vehicle"],
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80",
  },
];

export function getTechniciansForService(service?: string) {
  if (!service) return technicians;

  const s = service.trim().toLowerCase();

  // ✅ hỗ trợ query "all"
  if (s === "all") return technicians;

  // ✅ chỉ filter nếu đúng key
  if (!isServiceCategoryId(s)) return technicians;

  return technicians.filter((t) => t.services.includes(s));
}

export function labelService(service?: string) {
  if (!service) return "";

  const s = service.trim().toLowerCase();

  // ✅ tránh in "all"
  if (s === "all") return "Tất cả";

  // ✅ nếu đúng key thì map label
  if (isServiceCategoryId(s)) return serviceCategoryLabels[s];

  // ✅ fallback: trả nguyên văn (đỡ crash)
  return service;
}
