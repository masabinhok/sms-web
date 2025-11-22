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
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { GraduationCap } from 'lucide-react'

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
    <div className="min-h-screen bg-bg-premium p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text  flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-accent-primary" />
              Students Directory
            </h1>
            <p className="text-fg-premium-muted mt-2 text-lg">
              Manage and monitor student records and performance
            </p>
          </div>
          <Button 
            onClick={() => router.push('/admin/add-student')}
            className="bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white border-0 shadow-lg shadow-accent-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="glass-panel p-4 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-primary/20 rounded-lg">
                <Users className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm text-fg-premium-muted">Total Students</p>
                <p className="text-2xl font-bold text-fg-premium">{total}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-white/10 bg-white/5 glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-fg-premium">Student List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-fg-premium-muted" />
                    <Input
                      placeholder="Search students..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20 focus:border-accent-primary"
                    />
                  </div>
                  <Button variant="outline" className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-fg-premium-muted">Loading students...</div>
              ) : (
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-white/10">
                        <TableHead className="text-fg-premium font-semibold">Name</TableHead>
                        <TableHead className="text-fg-premium font-semibold">Class</TableHead>
                        <TableHead className="text-fg-premium font-semibold">Section</TableHead>
                        <TableHead className="text-fg-premium font-semibold">Roll No</TableHead>
                        <TableHead className="text-fg-premium font-semibold">Email</TableHead>
                        <TableHead className="text-fg-premium font-semibold">Guardian</TableHead>
                        <TableHead className="text-right text-fg-premium font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-fg-premium-muted">
                            No students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student, index) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer"
                            onClick={() => router.push(`/admin/students/${student.id}`)}
                          >
                            <TableCell className="font-medium text-fg-premium">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-xs font-bold">
                                  {student.fullName.split(' ').map((n) => n[0]).join('')}
                                </div>
                                {student.fullName}
                              </div>
                            </TableCell>
                            <TableCell className="text-fg-premium-muted">{student.classId}</TableCell>
                            <TableCell className="text-fg-premium-muted">{student.rollNumber}</TableCell>
                            <TableCell className="text-fg-premium-muted">{student.email}</TableCell>
                            <TableCell className="text-fg-premium-muted">
                              <div className="text-sm text-fg-premium">{student.guardianName}</div>
                              <div className="text-sm text-fg-premium-muted">{student.guardianContact}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  onClick={() => router.push(`/admin/students/${student.id}/edit`)}
                                  variant="ghost" size="icon" className="text-fg-premium-muted hover:text-accent-primary hover:bg-accent-primary/10"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(student)}
                                  variant="ghost" size="icon" className="text-fg-premium-muted hover:text-red-400 hover:bg-red-500/10"
                                  title="Delete"
                                  disabled={deleting === student.id}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

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
