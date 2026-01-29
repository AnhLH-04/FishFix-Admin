import { apiClient } from "./apiClient";

export type ApprovalItem = {
  technicianId: string;
  fullName: string;
  phone?: string;
  district?: string;
  city?: string;
  createdAt?: string;
  status: "pending" | "approved" | "rejected";
};

export type ApprovalDetail = {
  technicianId: string;
  fullName: string;
  phone?: string;
  city?: string;
  district?: string;
  yearsExp?: number;
  title?: string;
  ratingAvg?: number;
  mainService?: string;
  documents: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    type?: string;
  }>;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string | null;
};

export async function adminListApprovals(status: string) {
  return apiClient.get<ApprovalItem[]>(`/api/admin/technician-approvals?status=${status}`);
}

export async function adminGetApprovalDetail(id: string) {
  return apiClient.get<ApprovalDetail>(`/api/admin/technician-approvals/${id}`);
}

export async function adminApprove(id: string) {
  return apiClient.post(`/api/admin/technician-approvals/${id}/approve`);
}

export async function adminReject(id: string, reason: string) {
  return apiClient.post(`/api/admin/technician-approvals/${id}/reject`, { reason });
}
