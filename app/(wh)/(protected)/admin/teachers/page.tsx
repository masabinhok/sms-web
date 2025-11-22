'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { teacherApi, Teacher, TeacherQueryParams } from '@/lib/teacher-api'
import { useMessage } from '@/store/messageStore'
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const SUBJECTS_MAP: Record<string, string> = {
  MATH: 'Mathematics',
  SCIENCE: 'Science',
  ENGLISH: 'English',
  COMPUTER_SCIENCE: 'Computer Science',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  MUSIC: 'Music',
  DANCE: 'Dance',
  ART: 'Art',
  SOCIAL_STUDIES: 'Social Studies',
};

const CLASSES_MAP: Record<string, string> = {
  NURSERY: 'Nursery',
  LKG: 'LKG',
  UKG: 'UKG',
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH: '4th',
  FIFTH: '5th',
  SIXTH: '6th',
  SEVENTH: '7th',
  EIGHTH: '8th',
  NINTH: '9th',
  TENTH: '10th',
  ELEVENTH: '11th',
  TWELFTH: '12th',
};

export default function TeachersPage() {
  const router = useRouter()
  const { addMessage } = useMessage()
  
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Pagination and filtering state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filter state
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    teacher: Teacher | null;
  }>({ open: false, teacher: null })

  // Fetch teachers
  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const params: TeacherQueryParams = {
        page,
        limit,
        search: search || undefined,
        subject: subject || undefined,
        class: classFilter || undefined,
        sortBy,
        order,
      }
      
      const response = await teacherApi.getAll(params)
      setTeachers(response.data)
      setTotal(response.meta.total)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
      addMessage('Failed to load teachers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [page, limit, sortBy, order])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchTeachers()
      } else {
        setPage(1) // Reset to page 1 when filtering
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [search, subject, classFilter])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setOrder('asc')
    }
  }

  const handleDelete = async (teacher: Teacher) => {
    setDeleteDialog({ open: true, teacher })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.teacher) return
    
    setDeleting(deleteDialog.teacher.id)
    try {
      await teacherApi.delete(deleteDialog.teacher.id)
      addMessage('Teacher deleted successfully', 'success')
      setDeleteDialog({ open: false, teacher: null })
      fetchTeachers()
    } catch (error) {
      console.error('Failed to delete teacher:', error)
      addMessage('Failed to delete teacher', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-bg-premium p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-green-600" />
            Teachers Directory
          </h1>
          <p className="text-fg-premium-muted mt-2 text-lg">Manage teacher profiles and information</p>
        </div>
        <Button
          onClick={() => router.push('/admin/add-teacher')}
          className="flex items-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white border-0"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm text-fg-premium-muted">Total Teachers</p>
              <p className="text-2xl font-bold text-fg-premium">{total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-lg border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg-premium-muted w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20 focus:border-accent-primary"
              />
            </div>
          </div>
          <Input
            placeholder="Filter by subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20 focus:border-accent-primary"
          />
          <Input
            placeholder="Filter by class..."
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20 focus:border-accent-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-fg-premium uppercase tracking-wider cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-fg-premium uppercase tracking-wider cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-fg-premium uppercase tracking-wider cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center gap-2">
                    Phone
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-premium uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fg-premium uppercase tracking-wider">
                  Classes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-fg-premium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-fg-premium-muted">
                    Loading teachers...
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-fg-premium-muted">
                    No teachers found
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr 
                    key={teacher.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-fg-premium">{teacher.fullName}</div>
                      <div className="text-sm text-fg-premium-muted">{formatDate(teacher.dob)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-premium-muted">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-premium-muted">
                      {teacher.phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {teacher.subjectIds && teacher.subjectIds.length > 0 ? (
                          teacher.subjectIds.slice(0, 2).map((subj, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-accent-primary/20 text-accent-primary border-accent-primary/30 text-xs"
                            >
                              {SUBJECTS_MAP[subj] || subj}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-fg-premium-muted">None</span>
                        )}
                        {teacher.subjectIds && teacher.subjectIds.length > 2 && (
                          <Badge className="bg-white/10 text-fg-premium border-white/20 text-xs">
                            +{teacher.subjectIds.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {teacher.classIds && teacher.classIds.length > 0 ? (
                          teacher.classIds.slice(0, 2).map((cls, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-accent-secondary/20 text-accent-secondary border-accent-secondary/30 text-xs"
                            >
                              {CLASSES_MAP[cls] || cls}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-fg-premium-muted">None</span>
                        )}
                        {teacher.classIds && teacher.classIds.length > 2 && (
                          <Badge className="bg-white/10 text-fg-premium border-white/20 text-xs">
                            +{teacher.classIds.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => router.push(`/admin/teachers/${teacher.id}/edit`)}
                          className="text-accent-primary hover:text-accent-primary/80 p-1 hover:bg-accent-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete"
                          disabled={deleting === teacher.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-sm text-fg-premium-muted">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-fg-premium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, teacher: null })}>
        <DialogContent className="sm:max-w-[500px] bg-bg-premium border-white/10 text-fg-premium">
          <DialogHeader>
            <DialogTitle className="text-fg-premium">Delete Teacher</DialogTitle>
            <DialogDescription className="text-fg-premium-muted">
              Are you sure you want to delete {deleteDialog.teacher?.fullName}? This action cannot be undone and will also remove their login credentials.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, teacher: null })}
              className="border-white/10 hover:bg-white/10 text-fg-premium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
