import { api } from './api-client';

export interface Activity {
  id: string;
  userId: string;
  userRole: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  username?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'VIEW' | 'EXPORT';
  description: string;
  entityType: 'USER' | 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CLASS' | 'SUBJECT' | 'ASSIGNMENT' | 'GRADE' | 'ATTENDANCE' | 'SCHOOL_SETTINGS';
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface ActivityStats {
  total: number;
  byAction: Array<{ action: string; _count: number }>;
  byEntityType: Array<{ entityType: string; _count: number }>;
  byUserRole: Array<{ userRole: string; _count: number }>;
  recentActivities: Activity[];
}

export interface ActivitiesResponse {
  data: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ActivityQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  userRole?: 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'VIEW' | 'EXPORT';
  entityType?: 'USER' | 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CLASS' | 'SUBJECT' | 'ASSIGNMENT' | 'GRADE' | 'ATTENDANCE' | 'SCHOOL_SETTINGS';
  entityId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  order?: 'asc' | 'desc';
}

export const activityApi = {
  getAll: (params: ActivityQueryParams = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return api.get<ActivitiesResponse>(`/activity?${queryString}`);
  },

  getById: (id: string) => api.get<{ success: boolean; data: Activity }>(`/activity/${id}`),

  getStats: () => api.get<ActivityStats>('/activity/stats'),
};
