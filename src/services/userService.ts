import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5135';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============ Types ============

export interface UserDto {
    userId: string;
    email: string;
    phone: string;
    fullName: string | null;
    isActive: boolean;
    roleId: number;
    createdAt: string;
}

// ============ User APIs ============

export async function getAllUsers(roleId?: number): Promise<UserDto[]> {
    const { data } = await api.get('/api/identity/users', {
        params: roleId !== undefined ? { roleId } : {},
    });
    return data;
}

export async function getCustomers(): Promise<UserDto[]> {
    return getAllUsers(2); // roleId = 2 for customers
}
