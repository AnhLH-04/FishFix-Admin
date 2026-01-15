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
  },
];

export function getTechniciansForService(service?: string) {
  if (!service || service === "all") return technicians;

  const s = service.toLowerCase().trim() as ServiceCategoryId;
  return technicians.filter((t) => t.services.includes(s));
}

export function labelService(service?: string) {
  if (!service) return "";
  const key = service.toLowerCase().trim() as ServiceCategoryId;
  return serviceCategoryLabels[key] ?? service;
}
