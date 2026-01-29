// src/api/technician.api.ts
import { apiClient } from "./apiClient"; // axios instance có baseURL + interceptor Bearer token

export type MeDto = {
  id: string; // userId (uuid)
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: string[]; // tùy backend
};

export type WorkerProfileDto = {
  workerId: string; // uuid
  userId: string; // uuid
  bio?: string;
  availabilityStatus?: string; // "Online" | "Offline" | ...
  workingRadiusKm?: number;
  hourlyRate?: number;
  // ... thêm field nếu backend có
};

export type CertificationDto = {
  id: string;
  certName?: string;
  certNumber?: string;
  issuedBy?: string;
  issuedDate?: string; // ISO date
  expiryDate?: string; // ISO date
  documentUrl?: string;
  status?: string; // Pending/Approved/Rejected (nếu có)
  rejectReason?: string;
};

export async function getMe() {
  const { data } = await apiClient.get<MeDto>("/api/identity/me");
  return data;
}

export async function createWorkerProfile(payload: {
  userId: string;
  bio?: string;
  workingRadiusKm?: number;
  hourlyRate?: number;
}) {
  const { data } = await apiClient.post<WorkerProfileDto>("/api/dispatch/workers", payload);
  return data;
}

export async function getWorkerProfile(workerId: string) {
  const { data } = await apiClient.get<WorkerProfileDto>(`/api/dispatch/workers/${workerId}`);
  return data;
}

export async function updateWorkerProfile(
  workerId: string,
  payload: {
    bio?: string;
    availabilityStatus?: string;
    workingRadiusKm?: number;
    hourlyRate?: number;
  },
) {
  const { data } = await apiClient.put<WorkerProfileDto>(`/api/dispatch/workers/${workerId}`, payload);
  return data;
}

export async function listCertifications(workerId: string) {
  const { data } = await apiClient.get<CertificationDto[]>(`/api/dispatch/workers/${workerId}/certifications`);
  return data;
}

export async function addCertification(
  workerId: string,
  payload: {
    certName: string;
    certNumber?: string;
    issuedBy?: string;
    issuedDate?: string; // "YYYY-MM-DD"
    expiryDate?: string; // "YYYY-MM-DD"
    documentUrl: string; // URL file đã upload
  },
) {
  const { data } = await apiClient.post<CertificationDto>(`/api/dispatch/workers/${workerId}/certifications`, payload);
  return data;
}

export async function deleteCertification(certId: string) {
  await apiClient.delete(`/api/dispatch/certifications/${certId}`);
}
