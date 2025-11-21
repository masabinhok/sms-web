'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { studentApi, Student, StudentQueryParams } from '@/lib/student-api'
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
  Filter,
  Download,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export default function StudentsPage() {
  const router = useRouter()
  const { addMessage } = useMessage()
  
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Pagination and filtering state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filter state
  const [search, setSearch] = useState('')
  const [className, setClassName] = useState('')
  const [section, setSection] = useState('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null })

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params: StudentQueryParams = {
        page,
        limit,
        search: search || undefined,
        className: className || undefined,
        sortBy,
        order,
      }
      
      const response = await studentApi.getAll(params)
      setStudents(response.data)
      setTotal(response.meta.total)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      addMessage('Failed to load students', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [page, limit, sortBy, order])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchStudents()
      } else {
        setPage(1) // Reset to page 1 when filtering
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [search, className, section])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setOrder('asc')
    }
  }

  const handleDelete = async (student: Student) => {
    setDeleteDialog({ open: true, student })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.student) return
    
    setDeleting(deleteDialog.student.id)
    try {
      await studentApi.delete(deleteDialog.student.id)
      addMessage('Student deleted successfully', 'success')
      setDeleteDialog({ open: false, student: null })
      fetchStudents()
    } catch (error) {
      console.error('Failed to delete student:', error)
      addMessage('Failed to delete student', 'error')
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-premium tracking-tight">Students</h1>
          <p className="text-fg-premium-muted mt-1">Manage student profiles and information</p>
        </div>
        <Button
          onClick={() => router.push('/admin/add-student')}
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-primary/10 rounded-lg border border-accent-primary/20">
              <Users className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm text-fg-premium-muted">Total Students</p>
              <p className="text-2xl font-bold text-fg-premium">{total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg-premium-muted w-4 h-4" />
              <Input
                placeholder="Search by name, email, roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-bg-premium border-white/10 text-fg-premium placeholder:text-fg-premium-muted/50 focus:border-accent-primary/50"
              />
            </div>
          </div>
          <Input
            placeholder="Filter by class..."
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="bg-bg-premium border-white/10 text-fg-premium placeholder:text-fg-premium-muted/50 focus:border-accent-primary/50"
          />
          <Input
            placeholder="Filter by section..."
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="bg-bg-premium border-white/10 text-fg-premium placeholder:text-fg-premium-muted/50 focus:border-accent-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-fg-premium-muted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-fg-premium-muted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('class')}
                >
                  <div className="flex items-center gap-2">
                    Class
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-fg-premium-muted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('section')}
                >
                  <div className="flex items-center gap-2">
                    Section
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-fg-premium-muted uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => handleSort('rollNumber')}
                >
                  <div className="flex items-center gap-2">
                    Roll No
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-fg-premium-muted uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-fg-premium-muted uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-fg-premium-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-fg-premium-muted">
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-fg-premium-muted">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                    onClick={() => router.push(`/admin/students/${student.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-fg-premium group-hover:text-white transition-colors">{student.fullName}</div>
                      <div className="text-sm text-fg-premium-muted">{formatDate(student.dob)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-premium">
                      {student.classId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-premium">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-premium-muted">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-fg-premium">{student.guardianName}</div>
                      <div className="text-sm text-fg-premium-muted">{student.guardianContact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => router.push(`/admin/students/${student.id}/edit`)}
                          className="text-emerald-400 hover:text-emerald-300 p-2 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                          disabled={deleting === student.id}
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
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/5">
            <div className="text-sm text-fg-premium-muted">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="border-white/10 bg-transparent text-fg-premium hover:bg-white/10 hover:text-white"
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
                className="border-white/10 bg-transparent text-fg-premium hover:bg-white/10 hover:text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, student: null })}>
        <DialogContent className="sm:max-w-[500px] bg-bg-premium border-white/10">
          <DialogHeader>
            <DialogTitle className="text-fg-premium">Delete Student</DialogTitle>
            <DialogDescription className="text-fg-premium-muted">
              Are you sure you want to delete {deleteDialog.student?.fullName}? This action cannot be undone and will also remove their login credentials.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, student: null })}
              className="border-white/10 text-fg-premium hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
