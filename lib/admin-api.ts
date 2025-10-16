import { api } from './api-client';

export interface Admin {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  createdAt?: string;
}

export interface AdminsResponse {
  data: Admin[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const adminApi = {
  getAll: (params: AdminQueryParams = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return api.get<AdminsResponse>(`/auth/admins?${queryString}`);
  },

  getById: (id: string) => api.get<Admin>(`/auth/admins/${id}`),

  create: (data: { name: string; email: string }) => api.post('/auth/create-admin', data),

  update: (id: string, data: Partial<Admin>) => api.put<Admin>(`/auth/admins/${id}`, data),

  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/auth/admins/${id}`),

  getStats: () => api.get<{ total: number }>(`/auth/admins/stats/overview`),
};
