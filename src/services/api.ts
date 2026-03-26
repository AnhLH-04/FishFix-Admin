import axios, { AxiosError, AxiosInstance } from "axios";
import api from "./workerService";

// Base URL for the API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fishfix-backend.onrender.com";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      console.error("Network Error: Unable to connect to server");
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  },
);

// ============= Types =============
export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  role: "customer" | "worker";
}

export interface RegisterResponse {
  userId: string;
  message?: string;
}

export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  roleId: number;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
}

/** POST /api/bookings — theo api_design.md */
export interface CreateBookingRequest {
  jobId: string;
  bidId: string;
  customerId: string;
  workerId: string;
  finalAmount: number;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeStart?: string | null;
  scheduledTimeEnd?: string | null;
  depositAmount?: number | null;
}

export type BookingApiRecord = {
  bookingId: string;
  jobId: string;
  bidId: string;
  customerId: string;
  workerId: string;
  finalAmount?: number;
  depositAmount?: number | null;
  scheduledDate?: string;
  scheduledTimeStart?: string;
  scheduledTimeEnd?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
};

/** POST /api/jobs/{jobId}/bids */
export type CreateBidDto = {
  workerId: string;
  amount: number;
  message?: string | null;
  estimatedHours?: number | null;
  estimatedCompletion?: string | null;
};

export interface CreateWorkerProfileRequest {
  userId: string;
  bio: string;
  workingRadiusKm: number;
}

export interface WorkerProfileResponse {
  workerId: string;
}

export interface UpdateWorkerProfileRequest {
  bio?: string;
  availabilityStatus?: string;
  workingRadiusKm?: number;
}

export interface AddWorkerSkillRequest {
  categoryId: number;
  yearsOfExperience: number;
  isPrimarySkill: boolean;
}

export interface WorkerSkillResponse {
  skillId: string;
}

export interface WorkerSkill {
  skillId: string;
  categoryId: number;
  yearsOfExperience: number;
  isPrimarySkill: boolean;
}

export interface WorkerProfile {
  workerId: string;
  userId: string;
  bio: string;
  availabilityStatus: string;
  workingRadiusKm: number;
  skills: WorkerSkill[];
  /** Có trên nhiều response GET /api/dispatch/workers/{id} */
  fullName?: string | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
}

export interface ApiError {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

// ============= API Functions =============

// ===== Auth & Identity =====
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>("/api/identity/register", data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/api/identity/login", data);
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/identity/me");
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<void> => {
    await apiClient.put("/api/identity/me", data);
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<void> => {
    await apiClient.get("/api/identity/verify-email", { params: data });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post("/api/identity/resend-verification", { email });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post("/api/identity/forgot-password", data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/api/identity/reset-password", data);
  },
};

// ===== Booking & bids (dùng `api` từ workerService để cùng base URL + token với jobApi) =====
export const bidApi = {
  createBid: async (jobId: string, dto: CreateBidDto): Promise<{ bidId: string } | string> => {
    const { data } = await api.post<{ bidId: string } | string>(`/api/jobs/${jobId}/bids`, dto);
    return data;
  },

  acceptBid: async (bidId: string): Promise<void> => {
    await api.put(`/api/bids/${bidId}/accept`);
  },
};

function unwrapId(payload: unknown, key: string): string {
  if (typeof payload === "string" && payload.length > 0) return payload;
  if (payload && typeof payload === "object" && key in payload) {
    const v = (payload as Record<string, unknown>)[key];
    if (typeof v === "string" && v.length > 0) return v;
  }
  throw new Error(`Invalid API response: missing ${key}`);
}

export const bookingApi = {
  /**
   * GET /api/bookings?customerId=&workerId=&status=
   */
  getBookings: async (params?: { customerId?: string; workerId?: string; status?: string }): Promise<BookingApiRecord[]> => {
    const { data } = await api.get<BookingApiRecord[] | unknown>("/api/bookings", { params });
    if (Array.isArray(data)) return data;
    return [];
  },

  /**
   * POST /api/bookings — trả về bookingId (string hoặc object tùy backend)
   */
  createBooking: async (data: CreateBookingRequest): Promise<string> => {
    const { data: raw } = await api.post<unknown>("/api/bookings", data);
    return unwrapId(raw, "bookingId");
  },
};

// ===== Dispatch (Worker Profiles) =====
export const dispatchApi = {
  /**
   * Create worker profile
   */
  createWorkerProfile: async (data: CreateWorkerProfileRequest): Promise<WorkerProfileResponse> => {
    const response = await apiClient.post<WorkerProfileResponse>("/api/dispatch/workers", data);
    return response.data;
  },

  /**
   * Update worker profile
   */
  updateWorkerProfile: async (workerId: string, data: UpdateWorkerProfileRequest): Promise<void> => {
    await apiClient.put(`/api/dispatch/workers/${workerId}`, data);
  },

  /**
   * Add worker skill
   */
  addWorkerSkill: async (workerId: string, data: AddWorkerSkillRequest): Promise<WorkerSkillResponse> => {
    const response = await apiClient.post<WorkerSkillResponse>(`/api/dispatch/workers/${workerId}/skills`, data);
    return response.data;
  },

  /**
   * Get worker profile
   */
  getWorkerProfile: async (workerId: string): Promise<WorkerProfile> => {
    const response = await apiClient.get<WorkerProfile>(`/api/dispatch/workers/${workerId}`);
    return response.data;
  },
};

// ===== Health =====
export const healthApi = {
  /**
   * Check API health
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      await apiClient.get("/health");
      return true;
    } catch {
      return false;
    }
  },
};

// ===== Admin / Dashboard Stats =====
// ===== Admin Dashboard =====
// ===== Admin Dashboard =====
export const adminApi = {
  /**
   * Admin: list bookings (for dashboard counting)
   * GET /api/admin/bookings
   */
  getAdminBookings: async (params?: {
    customerId?: string;
    workerId?: string;
    status?: string; // IMPORTANT: đừng truyền "All" nếu backend không support
    scheduledFrom?: string; // yyyy-mm-dd
    scheduledTo?: string; // yyyy-mm-dd
  }): Promise<any> => {
    const response = await apiClient.get("/api/admin/bookings", { params });
    return response.data;
  },

  /**
   * Identity: list users
   * GET /api/identity/users
   */
  getUsers: async (roleId?: number): Promise<any> => {
    const response = await apiClient.get("/api/identity/users", {
      params: roleId ? { roleId } : undefined,
    });
    return response.data;
  },
};

// ===== Workers / Reviews (for optional rating aggregation) =====
export const workerApi = {
  /**
   * GET /api/dispatch/workers
   */
  getWorkers: async (params?: { isVerified?: boolean }): Promise<any> => {
    const response = await apiClient.get("/api/dispatch/workers", { params });
    return response.data;
  },
};

export const reviewApi = {
  /**
   * GET /api/workers/{workerId}/reviews
   */
  getWorkerReviews: async (workerId: string): Promise<any> => {
    const response = await apiClient.get(`/api/workers/${workerId}/reviews`);
    return response.data;
  },
};
// ===== Admin =====
export type AdminBookingQuery = {
  customerId?: string;
  workerId?: string;
  status?: string; // đừng set "All" nếu backend không hỗ trợ
  scheduledFrom?: string; // YYYY-MM-DD
  scheduledTo?: string; // YYYY-MM-DD
};

// Booking type: backend có thể trả field khác nhau, nên để optional + any-safe
export type BookingItem = {
  bookingId?: string;
  status?: string;
  finalAmount?: number;
  amount?: number;
  scheduledDate?: string; // YYYY-MM-DD
  createdAt?: string; // ISO
  [key: string]: any;
};

export type UserItem = {
  userId?: string;
  roleId?: number;
  createdAt?: string; // nếu có
  [key: string]: any;
};

export type WorkerItem = {
  workerId?: string;
  availabilityStatus?: string; // nếu có
  [key: string]: any;
};

// export const adminApi = {
//   getAdminBookings: async (params?: AdminBookingQuery): Promise<BookingItem[]> => {
//     const res = await apiClient.get<BookingItem[]>("/api/admin/bookings", { params });
//     return res.data ?? [];
//   },
// };

export const identityApi = {
  getUsers: async (roleId?: number): Promise<UserItem[]> => {
    const res = await apiClient.get<UserItem[]>("/api/identity/users", { params: roleId ? { roleId } : undefined });
    return res.data ?? [];
  },
};

// export const workerApi = {
//   getWorkers: async (isVerified?: boolean): Promise<WorkerItem[]> => {
//     const res = await apiClient.get<WorkerItem[]>("/api/dispatch/workers", {
//       params: typeof isVerified === "boolean" ? { isVerified } : undefined,
//     });
//     return res.data ?? [];
//   },
// };
// services/api.ts
// (Bạn giữ nguyên axios instance/token interceptor hiện có, chỉ cần thêm phần dưới)

// =======================
// Categories API
// =======================

export type CategoryItem = {
  categoryId?: number;
  id?: number;
  name?: string;
  title?: string;
  isActive?: boolean;
  active?: boolean;
  // backend trả field nào thêm cũng không crash TS
  [key: string]: any;
};

export const categoryApi = {
  async getCategories(params?: { activeOnly?: boolean }) {
    // GET /api/categories?activeOnly=...
    const { data } = await api.get("/api/categories", { params });
    return data as CategoryItem[];
  },
};

// =======================
// Jobs API
// =======================

export type JobStatus = "new" | "pending" | "finding" | "assigned" | "in_progress" | "completed" | "cancelled" | string;

export type JobItem = {
  jobId?: string;
  id?: string;

  customerId?: string;
  workerId?: string;

  categoryId?: number;
  title?: string;
  description?: string;

  address?: string;
  ward?: string;
  district?: string;
  city?: string;

  latitude?: number;
  longitude?: number;

  estimatedBudget?: number;
  urgency?: string;

  preferredDate?: string; // yyyy-mm-dd
  preferredTimeStart?: string; // time
  preferredTimeEnd?: string; // time

  status?: JobStatus;
  createdAt?: string;

  [key: string]: any;
};

// body đúng theo swagger CreateJob :contentReference[oaicite:8]{index=8}
export type CreateJobDto = {
  customerId: string;
  categoryId: number;
  title?: string | null;
  description?: string | null;
  address?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  estimatedBudget?: number | null;
  urgency?: string | null;
  preferredDate?: string | null; // date
  preferredTimeStart?: string | null; // time
  preferredTimeEnd?: string | null; // time
};

// body đúng theo swagger UpdateJobStatusRequest :contentReference[oaicite:9]{index=9}
export type UpdateJobStatusDto = {
  status?: string | null;
};

export const jobApi = {
  // GET /api/jobs?customerId=...
  async getJobs(params?: { customerId?: string }) {
    const { data } = await api.get("/api/jobs", { params });
    return data as JobItem[];
  },

  // POST /api/jobs
  async createJob(dto: CreateJobDto) {
    const { data } = await api.post("/api/jobs", dto);
    return data as JobItem;
  },

  // GET /api/jobs/{jobId}
  async getJob(jobId: string) {
    const { data } = await api.get(`/api/jobs/${jobId}`);
    return data as JobItem;
  },

  // DELETE /api/jobs/{jobId}
  async deleteJob(jobId: string) {
    const { data } = await api.delete(`/api/jobs/${jobId}`);
    return data;
  },

  // GET /api/jobs/available?categoryId=&city=&district=
  async getAvailableJobs(params?: { categoryId?: number; city?: string; district?: string }) {
    const { data } = await api.get("/api/jobs/available", { params });
    return data as JobItem[];
  },

  // PATCH /api/jobs/{jobId}/status
  async updateJobStatus(jobId: string, dto: UpdateJobStatusDto) {
    const { data } = await api.patch(`/api/jobs/${jobId}/status`, dto);
    return data;
  },
};

export default apiClient;
