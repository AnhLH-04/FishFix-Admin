import { apiClient } from "./apiClient";

export type WorkerProfile = {
  id?: string;
  userId: string;
  bio?: string | null;
  availabilityStatus?: string | null;
  workingRadiusKm?: number | null;

  hourlyRate?: number | null;
  idCardNumber?: string | null;
  idCardFrontUrl?: string | null;
  idCardBackUrl?: string | null;

  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
};

export type CreateWorkerProfileReq = {
  userId: string;
  bio?: string | null;
  workingRadiusKm: number;
  hourlyRate?: number | null;

  idCardNumber?: string | null;
  idCardFrontUrl?: string | null;
  idCardBackUrl?: string | null;

  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
};

export type UpdateWorkerProfileReq = {
  bio?: string | null;
  availabilityStatus?: string | null;
  workingRadiusKm?: number | null;
};

export type Certification = {
  id: string;
  workerId?: string;
  certName?: string | null;
  certNumber?: string | null;
  issuedBy?: string | null;
  issuedDate?: string | null; // yyyy-MM-dd
  expiryDate?: string | null; // yyyy-MM-dd
  documentUrl?: string | null;

  // NOTE: swagger schema không show field status.
  // Nếu backend có trả "isVerified"/"status" thì bạn map thêm ở đây.
  isVerified?: boolean;
  status?: "Pending" | "Approved" | "Rejected";
  rejectReason?: string | null;
};

export type AddCertificationReq = {
  certName?: string | null;
  certNumber?: string | null;
  issuedBy?: string | null;
  issuedDate?: string | null;
  expiryDate?: string | null;
  documentUrl?: string | null;
};

export type UpdateCertificationReq = AddCertificationReq;

export async function createWorkerProfile(body: CreateWorkerProfileReq) {
  return apiClient.post<WorkerProfile>("/api/dispatch/workers", body);
}

export async function getWorkerProfile(workerId: string) {
  return apiClient.get<WorkerProfile>(`/api/dispatch/workers/${workerId}`);
}

export async function updateWorkerProfile(workerId: string, body: UpdateWorkerProfileReq) {
  return apiClient.put<WorkerProfile>(`/api/dispatch/workers/${workerId}`, body);
}

export async function listWorkerCertifications(workerId: string) {
  return apiClient.get<Certification[]>(`/api/dispatch/workers/${workerId}/certifications`);
}

export async function addWorkerCertification(workerId: string, body: AddCertificationReq) {
  return apiClient.post<Certification>(`/api/dispatch/workers/${workerId}/certifications`, body);
}

export async function updateCertification(certId: string, body: UpdateCertificationReq) {
  return apiClient.put<Certification>(`/api/dispatch/certifications/${certId}`, body);
}

export async function deleteCertification(certId: string) {
  return apiClient.delete(`/api/dispatch/certifications/${certId}`);
}

// admin duyệt
export async function verifyCertification(certId: string, adminUserId: string) {
  return apiClient.post(`/api/dispatch/certifications/${certId}/verify`, { adminUserId });
}
