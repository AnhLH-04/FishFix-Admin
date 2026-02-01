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

export interface WorkerProfile {
    workerId: string;
    userId: string;
    fullName?: string; // From joined User table
    phone?: string;    // From joined User table
    email?: string;    // From joined User table
    bio: string;
    hourlyRate: number;
    serviceFeePercent: number;
    ratingAvg: number;
    ratingCount: number;
    completedJobs: number;
    responseTimeMinutes: number;
    availabilityStatus: 'available' | 'busy' | 'offline';
    workingRadiusKm: number;
    idCardNumber: string;
    idCardFrontUrl: string;
    idCardBackUrl: string;
    isVerified: boolean;
    verifiedAt: string | null;
    verifiedBy: string | null;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    createdAt: string;
    updatedAt: string;
    skills: WorkerSkill[];
}

export interface WorkerSkill {
    skillId: string;
    categoryId: number;
    yearsOfExperience: number;
    isPrimarySkill: boolean;
}

export interface Certification {
    certId: string;
    workerId: string;
    certName: string;
    certNumber?: string;
    issuedBy?: string;
    issuedDate?: string;
    expiryDate?: string;
    documentUrl?: string;
    isVerified: boolean;
    verifiedAt?: string | null;
    isExpired?: boolean;
}

export interface UpdateWorkerProfileDto {
    bio?: string;
    availabilityStatus?: 'available' | 'busy' | 'offline';
    workingRadiusKm?: number;
    hourlyRate?: number;
    idCardNumber?: string;
    idCardFrontUrl?: string;
    idCardBackUrl?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankName?: string;
}

export interface CreateSkillDto {
    categoryId: number;
    yearsOfExperience: number;
    isPrimarySkill: boolean;
}

export interface CreateCertificationDto {
    certName: string;
    certNumber?: string;
    issuedBy?: string;
    issuedDate?: string;
    expiryDate?: string;
    documentUrl?: string;
}

// ============ Worker Profile APIs ============

export async function getWorkerProfile(workerId: string): Promise<WorkerProfile> {
    const { data } = await api.get(`/api/dispatch/workers/${workerId}`);
    return data;
}

export async function getWorkerProfileByUserId(userId: string): Promise<WorkerProfile> {
    const { data } = await api.get(`/api/dispatch/workers/by-user/${userId}`);
    return data;
}

export async function createWorkerProfile(dto: any): Promise<WorkerProfile> {
    const { data } = await api.post('/api/dispatch/workers', dto);
    return data;
}

export async function updateWorkerProfile(
    workerId: string,
    dto: UpdateWorkerProfileDto
): Promise<void> {
    await api.put(`/api/dispatch/workers/${workerId}`, dto);
}

export async function updateWorkerAvailability(
    workerId: string,
    status: 'available' | 'busy' | 'offline'
): Promise<void> {
    await api.put(`/api/dispatch/workers/${workerId}/availability`, { status });
}

export async function verifyWorker(workerId: string): Promise<void> {
    await api.put(`/api/dispatch/workers/${workerId}/verify`);
}

export async function rejectWorker(workerId: string, reason: string): Promise<void> {
    // Assumption: Backend adds this for worker rejection too
    await api.put(`/api/dispatch/workers/${workerId}/reject`, { reason });
}

// ============ Skills APIs ============
export async function addWorkerSkill(
    workerId: string,
    dto: CreateSkillDto
): Promise<{ skillId: string }> {
    const { data } = await api.post(`/api/dispatch/workers/${workerId}/skills`, dto);
    return data;
}

export async function deleteWorkerSkill(skillId: string): Promise<void> {
    await api.delete(`/api/dispatch/skills/${skillId}`);
}

// ============ Certifications APIs ============

export async function getWorkerCertifications(workerId: string): Promise<Certification[]> {
    const { data } = await api.get(`/api/dispatch/workers/${workerId}/certifications`);
    return data;
}

export async function addCertification(
    workerId: string,
    dto: CreateCertificationDto
): Promise<{ certId: string }> {
    const { data } = await api.post(`/api/dispatch/workers/${workerId}/certifications`, dto);
    return data;
}

export async function updateCertification(
    certId: string,
    dto: CreateCertificationDto
): Promise<void> {
    await api.put(`/api/dispatch/certifications/${certId}`, dto);
}

export async function deleteCertification(certId: string): Promise<void> {
    await api.delete(`/api/dispatch/certifications/${certId}`);
}

export async function verifyCertification(certId: string): Promise<void> {
    await api.post(`/api/dispatch/certifications/${certId}/verify`);
}

// ============ List Workers (for Admin) ============

export async function getAllWorkers(isVerified?: boolean): Promise<WorkerProfile[]> {
    const { data } = await api.get('/api/dispatch/workers', {
        params: isVerified !== undefined ? { isVerified } : {},
    });
    return data;
}
