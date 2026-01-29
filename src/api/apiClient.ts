// // src/lib/apiClient.ts
// import axios, { AxiosError, type AxiosInstance } from "axios";

// export type ApiError = {
//   status: number;
//   message: string;
//   details?: unknown;
// };

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// export const apiClient: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   timeout: 30000,
//   withCredentials: false,
// });

// // Request interceptor (thêm token nếu có)
// apiClient.interceptors.request.use((config) => {
//   // Ví dụ: const token = localStorage.getItem("token");
//   // if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Response interceptor (chuẩn hóa lỗi)
// apiClient.interceptors.response.use(
//   (res) => res,
//   (error: AxiosError) => {
//     const status = error.response?.status ?? 0;
//     const details = error.response?.data;
//     const message = (details as any)?.message || error.message || "Request failed";

//     const apiError: ApiError = { status, message, details };
//     return Promise.reject(apiError);
//   }
// );
// src/lib/apiClient.ts
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const TOKEN_STORAGE_KEY = "fishfix_token";

/**
 * remember=true  -> localStorage (giữ qua lần mở trình duyệt)
 * remember=false -> sessionStorage (đóng tab là mất)
 */
export function getAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string, remember: boolean = true): void {
  // clear cả 2 trước cho sạch
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function normalizeErrorMessage(details: any, fallback: string) {
  if (typeof details === "string" && details.trim()) return details;

  const msg = details?.message || details?.title || details?.error || details?.detail || details?.Message || "";
  if (typeof msg === "string" && msg.trim()) return msg;

  const errors = details?.errors;
  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstVal = firstKey ? errors[firstKey] : null;
    if (Array.isArray(firstVal) && firstVal[0]) return String(firstVal[0]);
  }

  return fallback || "Request failed";
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
  withCredentials: false,
});

// ✅ Request interceptor (tự thêm token nếu có)
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor (chuẩn hóa lỗi + auto logout nếu 401)
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const details = error.response?.data;
    const message = normalizeErrorMessage(details, error.message);

    if (status === 401) {
      clearAccessToken(); // xoá cả local + session
    }

    const apiError: ApiError = { status, message, details };
    return Promise.reject(apiError);
  },
);

export function isApiError(e: unknown): e is ApiError {
  return !!e && typeof e === "object" && "status" in e && "message" in e;
}
