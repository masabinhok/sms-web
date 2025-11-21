/**
 * React Query Hooks for Students API
 * Provides data fetching, caching, and mutations for student management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi, Student, StudentQueryParams, CreateStudentData, UpdateStudentData } from '@/lib/student-api';
import { queryKeys } from '@/lib/react-query';

/**
 * Fetch all students with pagination and filtering
 */
export function useStudents(params: StudentQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.students.all(params),
    queryFn: () => studentApi.getAll(params),
  });
}

/**
 * Fetch single student by ID
 */
export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentApi.getById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
}

/**
 * Create new student with optimistic updates
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.stats });
    },
  });
}

/**
 * Update existing student
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) =>
      studentApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific student and list
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

/**
 * Delete student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentApi.delete(id),
    onSuccess: () => {
      // Invalidate students list
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.stats });
    },
  });
}

/**
 * Get student statistics
 */
export function useStudentStats() {
  return useQuery({
    queryKey: queryKeys.students.stats,
    queryFn: () => studentApi.getStats(),
  });
}
