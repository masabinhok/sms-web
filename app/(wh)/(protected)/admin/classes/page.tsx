'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMessage } from '@/store/messageStore'
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  type Class,
  type CreateClassDto,
  type UpdateClassDto,
} from '@/lib/academics-api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Filter, Search, GraduationCap, Users, Calendar, CheckCircle2, XCircle, Download, Upload, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClassManagementPage() {
  const router = useRouter()
  const { addMessage } = useMessage()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [filterGrade, setFilterGrade] = useState<string>('all')
  const [formData, setFormData] = useState<CreateClassDto>({
    name: '',
    grade: 1,
    section: '',
    capacity: 30,
    academicYear: new Date().getFullYear().toString(),
    description: '',
    isActive: true,
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  async function fetchClasses() {
    try {
      setLoading(true)
      const data = await getAllClasses()
      console.log('Fetched classes data:', data)
      setClasses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setSelectedClass(null)
    setFormData({
      name: '',
      grade: 1,
      section: '',
      capacity: 30,
      academicYear: new Date().getFullYear().toString(),
      description: '',
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(classItem: Class) {
    setSelectedClass(classItem)
    setFormData({
      name: classItem.name,
      grade: classItem.grade,
      section: classItem.section || '',
      capacity: classItem.capacity,
      academicYear: classItem.academicYear,
      description: classItem.description || '',
      isActive: classItem.isActive,
    })
    setIsDialogOpen(true)
  }

  function openDeleteDialog(classItem: Class) {
    setSelectedClass(classItem)
    setIsDeleteDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (selectedClass) {
        await updateClass({ id: selectedClass.id, ...formData })
        addMessage(`Successfully updated ${formData.name}!`, 'success')
      } else {
        await createClass(formData)
        addMessage(`Successfully created ${formData.name}!`, 'success')
      }
      setIsDialogOpen(false)
      fetchClasses()
    } catch (error) {
      const err = error as { message?: string };
      addMessage(err.message || 'Failed to save class', 'error')
    }
  }

  async function handleDelete() {
    if (!selectedClass) return

    try {
      await deleteClass(selectedClass.id)
      setIsDeleteDialogOpen(false)
      fetchClasses()
      addMessage(`Successfully deleted ${selectedClass.name}!`, 'success')
    } catch (error) {
      const err = error as { message?: string };
      addMessage(err.message || 'Failed to delete class', 'error')
    }
  }

  // Advanced filtering with search and memoization
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Search filter
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !c.section?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Year filter
      if (filterYear !== 'all' && c.academicYear !== filterYear) return false
      
      // Status filter
      if (filterActive === 'active' && !c.isActive) return false
      if (filterActive === 'inactive' && c.isActive) return false
      
      // Grade filter
      if (filterGrade !== 'all' && c.grade.toString() !== filterGrade) return false
      
      return true
    })
  }, [classes, searchQuery, filterYear, filterActive, filterGrade])

  const uniqueYears = Array.from(new Set(classes.map((c) => c.academicYear))).sort()
  const uniqueGrades = Array.from(new Set(classes.map((c) => c.grade))).sort((a, b) => a - b)

  // Statistics
  const stats = useMemo(() => ({
    total: classes.length,
    active: classes.filter(c => c.isActive).length,
    inactive: classes.filter(c => !c.isActive).length,
    totalCapacity: classes.reduce((sum, c) => sum + c.capacity, 0)
  }), [classes])

  return (
    <div className="min-h-screen bg-bg-premium p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text  flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-accent-primary" />
            Class Management
          </h1>
          <p className="text-fg-premium-muted mt-2 text-lg">
            Manage classes, sections, and academic years with ease
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={openCreateDialog} size="lg" className="shadow-lg shadow-accent-primary/30 bg-gradient-to-r from-accent-primary to-accent-secondary border-0 text-white hover:opacity-90 hover:shadow-xl hover:shadow-accent-primary/40 transition-all">
            <Plus className="mr-2 h-5 w-5" /> Create Class
          </Button>
        </motion.div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Total Classes',
            value: stats.total,
            icon: GraduationCap,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10'
          },
          {
            title: 'Active Classes',
            value: stats.active,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10'
          },
          {
            title: 'Inactive Classes',
            value: stats.inactive,
            icon: XCircle,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500/10'
          },
          {
            title: 'Total Capacity',
            value: stats.totalCapacity,
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10'
          }
        ].map((stat) => (
          <motion.div
            key={stat.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="overflow-hidden border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--fg-premium-muted)]">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 text-[var(--fg-premium)]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text `} strokeWidth={2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg border-white/10 glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--fg-premium)]">
              <Filter className="h-5 w-5 text-[var(--accent-primary)]" />
              Search & Filters
            </CardTitle>
            <CardDescription className="text-[var(--fg-premium-muted)]">Find and filter classes quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-premium-muted" />
                <Input
                  placeholder="Search by class name or section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-white/10 bg-white/5 text-[var(--fg-premium)] focus:border-[var(--accent-primary)] transition-colors placeholder:text-white/20"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 flex-wrap">
                <Select value={filterGrade} onValueChange={setFilterGrade}>
                  <SelectTrigger className="w-[150px] border-white/10 bg-white/5 text-[var(--fg-premium)]">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-[var(--fg-premium)]">
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-[150px] border-white/10 bg-white/5 text-[var(--fg-premium)]">
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-[var(--fg-premium)]">
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterActive} onValueChange={setFilterActive}>
                  <SelectTrigger className="w-[150px] border-white/10 bg-white/5 text-[var(--fg-premium)]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-[var(--fg-premium)]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterGrade('all')
                    setFilterYear('all')
                    setFilterActive('all')
                  }}
                  className="gap-2 border-white/10 bg-white/5 text-[var(--fg-premium)] hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-[var(--fg-premium-muted)]">
              <span>
                Showing <span className="font-semibold text-[var(--accent-primary)]">{filteredClasses.length}</span> of{' '}
                <span className="font-semibold text-[var(--fg-premium)]">{classes.length}</span> classes
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-[var(--accent-primary)]/30 bg-white/5 text-[var(--fg-premium)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 transition-all shadow-sm hover:shadow-md">
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-[var(--accent-primary)]/30 bg-white/5 text-[var(--fg-premium)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 transition-all shadow-sm hover:shadow-md">
                  <Upload className="h-4 w-4" /> Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Classes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg border-white/10 overflow-hidden glass-panel">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-white/5" />
                ))}
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="p-16 text-center">
                <GraduationCap className="mx-auto h-16 w-16 text-white/20 mb-4" />
                <p className="text-[var(--fg-premium)] text-lg font-medium">No classes found</p>
                <p className="text-[var(--fg-premium-muted)] text-sm mt-2">
                  {searchQuery || filterYear !== 'all' || filterActive !== 'all' || filterGrade !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first class to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/5 hover:bg-white/10 border-white/10">
                      <TableHead className="font-semibold text-[var(--fg-premium)]">Class Name</TableHead>
                      <TableHead className="font-semibold text-[var(--fg-premium)]">Grade</TableHead>
                      <TableHead className="font-semibold text-[var(--fg-premium)]">Section</TableHead>
                      <TableHead className="font-semibold text-[var(--fg-premium)]">Capacity</TableHead>
                      <TableHead className="font-semibold text-[var(--fg-premium)]">Academic Year</TableHead>
                      <TableHead className="font-semibold text-[var(--fg-premium)]">Status</TableHead>
                      <TableHead className="text-right font-semibold w-[120px] text-[var(--fg-premium)]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredClasses.map((classItem, index) => (
                        <motion.tr
                          key={classItem.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => router.push(`/admin/classes/${classItem.id}`)}
                          className="group hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer"
                        >
                          <TableCell className="font-medium text-[var(--fg-premium)]">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold shadow-md">
                                {classItem.name.charAt(0)}
                              </div>
                              <span className="group-hover:text-[var(--accent-primary)] transition-colors font-medium">
                                {classItem.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium border-white/20 text-[var(--fg-premium)]">
                              Grade {classItem.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {classItem.section ? (
                              <Badge variant="secondary" className="font-medium bg-white/10 text-[var(--fg-premium)] hover:bg-white/20">{classItem.section}</Badge>
                            ) : (
                              <span className="text-[var(--fg-premium-muted)]">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-[var(--fg-premium)]">
                              <Users className="h-4 w-4 text-[var(--fg-premium-muted)]" />
                              <span className="font-medium">{classItem.capacity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-[var(--fg-premium)]">
                              <Calendar className="h-4 w-4 text-[var(--fg-premium-muted)]" />
                              <span>{classItem.academicYear}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant={classItem.isActive ? 'default' : 'secondary'}
                                className={classItem.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'}
                              >
                                {classItem.isActive ? (
                                  <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                                ) : (
                                  <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
                                )}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(classItem)}
                                className="hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] text-[var(--fg-premium-muted)] hover:border-[var(--accent-primary)]/30 border border-transparent transition-all"
                              >
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(classItem)}
                                className="hover:bg-red-500/10 hover:text-red-400 text-[var(--fg-premium-muted)] hover:border-red-500/30 border border-transparent transition-all"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--bg-premium)] border-white/10 text-[var(--fg-premium)]">
          <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedClass ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                {selectedClass ? (
                  <Pencil className="h-6 w-6 text-blue-400" />
                ) : (
                  <Plus className="h-6 w-6 text-green-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[var(--fg-premium)]">
                  {selectedClass ? 'Edit Class' : 'Create New Class'}
                </DialogTitle>
                <DialogDescription className="text-base mt-1 text-[var(--fg-premium-muted)]">
                  {selectedClass
                    ? 'Update class information below'
                    : 'Add a new class to your school management system'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="name" className="text-sm font-semibold text-[var(--fg-premium)] flex items-center gap-1">
                  Class Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Grade 5 - Section A"
                  required
                  className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]/20"
                />
              </div>

              <div>
                <Label htmlFor="grade" className="text-sm font-semibold text-[var(--fg-premium)] flex items-center gap-1">
                  Grade <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.grade.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, grade: parseInt(value) })
                  }
                >
                  <SelectTrigger className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-[var(--fg-premium)]">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section" className="text-sm font-semibold text-[var(--fg-premium)]">Section</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  placeholder="e.g., A, B, C"
                  className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]/20"
                />
              </div>

              <div>
                <Label htmlFor="capacity" className="text-sm font-semibold text-[var(--fg-premium)] flex items-center gap-1">
                  Capacity <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) })
                  }
                  min={1}
                  required
                  className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]/20"
                />
              </div>

              <div>
                <Label htmlFor="academicYear" className="text-sm font-semibold text-[var(--fg-premium)] flex items-center gap-1">
                  Academic Year <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) =>
                    setFormData({ ...formData, academicYear: e.target.value })
                  }
                  placeholder="e.g., 2024-2025"
                  required
                  className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]/20"
                />
              </div>

              <div>
                <Label htmlFor="isActive" className="text-sm font-semibold text-[var(--fg-premium)] flex items-center gap-1">
                  Status <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.isActive ? 'true' : 'false'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === 'true' })
                  }
                >
                  <SelectTrigger className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-[var(--fg-premium)]">
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" /> Active
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-400" /> Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-[var(--fg-premium)]">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional class description..."
                rows={3}
                className="mt-2 border-white/10 bg-white/5 text-[var(--fg-premium)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]/20"
              />
            </div>

            <DialogFooter className="bg-white/5 -mx-6 -mb-6 px-6 py-4 mt-8 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-white/10 border-white/10 text-[var(--fg-premium)]"
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:opacity-90 text-white border-2 border-[var(--accent-primary)]/50 shadow-lg shadow-[var(--accent-primary)]/40 hover:shadow-lg hover:shadow-[var(--accent-primary)]/60 transition-all">
                {selectedClass ? (
                  <><CheckCircle2 className="h-4 w-4" /> Update Class</>
                ) : (
                  <><Plus className="h-4 w-4" /> Create Class</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[var(--bg-premium)] border-white/10 text-[var(--fg-premium)]">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2 text-xl">
              <Trash2 className="h-6 w-6" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-base pt-2 text-[var(--fg-premium-muted)]">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[var(--fg-premium)]">
                {selectedClass?.name}
              </span>
              ? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 hover:bg-white/10 text-[var(--fg-premium)]"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2 bg-red-500 hover:bg-red-600 border-2 border-red-500/50 shadow-lg shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/40 transition-all">
              <Trash2 className="h-4 w-4" /> Delete Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}