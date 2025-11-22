import { api } from './api-client';

export interface Teacher {
  id: string;
  fullName: string;
  dob: string;
  email: string;
  gender?: string;
  phone: string;
  address: string;
  subjectIds?: string[];
  classIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  class?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface TeachersResponse {
  data: Teacher[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTeacherData {
  fullName: string;
  dob: string;
  email: string;
  gender?: string;
  phone: string;
  address: string;
  subjectIds?: string[];
  classIds?: string[];
}

export type UpdateTeacherData = Partial<CreateTeacherData>

export const teacherApi = {
  // Get all teachers with pagination and filtering
  getAll: (params: TeacherQueryParams = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();
    
    return api.get<TeachersResponse>(`/teacher?${queryString}`);
  },

  // Get single teacher by ID
  getById: (id: string) =>
    api.get<Teacher>(`/teacher/${id}`),

  // Create new teacher
  create: (data: CreateTeacherData) =>
    api.post<Teacher>('/teacher/create-profile', data),

  // Update teacher
  update: (id: string, data: UpdateTeacherData) =>
    api.put<Teacher>(`/teacher/${id}`, data),

  // Delete teacher
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/teacher/${id}`),

  // Get teacher statistics
  getStats: () =>
    api.get<{
      total: number;
      bySubject: Array<{ subject: string; _count: number }>;
      byClass: Array<{ class: string; _count: number }>;
      byGender: Array<{ gender: string; _count: number }>;
    }>('/teacher/stats/overview'),
};
