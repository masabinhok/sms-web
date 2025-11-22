import { api } from './api-client';

export interface Student {
  id: string;
  fullName: string;
  dob: string;
  email: string;
  gender?: string;
  classId: string;
  rollNumber: number;
  guardianName: string;
  guardianContact: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  className?: string; // This can now be classId
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface StudentsResponse {
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateStudentData {
  fullName: string;
  dob: string;
  email: string;
  gender?: string;
  classId: string;
  guardianName: string;
  guardianContact: string;
  address?: string;
}

export type UpdateStudentData = Partial<CreateStudentData>

export const studentApi = {
  // Get all students with pagination and filtering
  getAll: (params: StudentQueryParams = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();
    
    return api.get<StudentsResponse>(`/students?${queryString}`);
  },

  // Get single student by ID
  getById: (id: string) =>
    api.get<Student>(`/students/${id}`),

  // Create new student
  create: (data: CreateStudentData) =>
    api.post<Student>('/students', data),

  // Update student
  update: (id: string, data: UpdateStudentData) =>
    api.put<Student>(`/students/${id}`, data),

  // Delete student
  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/students/${id}`),

  // Get student statistics
  getStats: () =>
    api.get<{
      total: number;
      byClass: Array<{ classId: string; _count: number }>;
      byGender: Array<{ gender: string; _count: number }>;
    }>('/students/stats/overview'),
};
