import axios, { AxiosError, AxiosInstance } from 'axios';

// Base URL for the API
// In development, use relative path to leverage Vite proxy (bypass CORS)
// In production, use env variable or fallback to production URL
const BASE_URL = import.meta.env.DEV 
  ? '' // Empty string means relative path, will use Vite proxy
  : import.meta.env.VITE_API_BASE_URL || 'https://fishfix-backend.onrender.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Unable to connect to server');
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

// ============= Types =============
export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  role: 'customer' | 'worker';
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

export interface CreateBookingRequest {
  customerName: string;
  description: string;
}

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
    const response = await apiClient.post<RegisterResponse>('/api/identity/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/identity/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/identity/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<void> => {
    await apiClient.put('/api/identity/me', data);
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<void> => {
    await apiClient.get('/api/identity/verify-email', { params: data });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post('/api/identity/resend-verification', { email });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/api/identity/forgot-password', data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/api/identity/reset-password', data);
  },
};

// ===== Booking =====
export const bookingApi = {
  /**
   * Create a booking (mock)
   */
  createBooking: async (data: CreateBookingRequest): Promise<string> => {
    const response = await apiClient.post<string>('/api/bookings', data);
    return response.data;
  },
};

// ===== Dispatch (Worker Profiles) =====
export const dispatchApi = {
  /**
   * Create worker profile
   */
  createWorkerProfile: async (data: CreateWorkerProfileRequest): Promise<WorkerProfileResponse> => {
    const response = await apiClient.post<WorkerProfileResponse>('/api/dispatch/workers', data);
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
    const response = await apiClient.post<WorkerSkillResponse>(
      `/api/dispatch/workers/${workerId}/skills`,
      data
    );
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
      await apiClient.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};

export default apiClient;
