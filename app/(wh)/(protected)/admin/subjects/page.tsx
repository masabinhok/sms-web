'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMessage } from '@/store/messageStore'
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type Subject,
  type CreateSubjectDto,
  type UpdateSubjectDto,
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
import { Plus, Pencil, Trash2, Filter, BookOpen, Search, CheckCircle2, XCircle, Download, Upload, RefreshCw, Award, GraduationCap, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SUBJECT_CATEGORIES = ['Core', 'Elective', 'Extra-curricular', 'Other']

export default function SubjectManagementPage() {
  const { addMessage } = useMessage()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [formData, setFormData] = useState<CreateSubjectDto>({
    name: '',
    code: '',
    description: '',
    category: 'Core',
    creditHours: 3,
    fullMarks: 100,
    passMarks: 40,
    hasTheory: true,
    hasPractical: false,
    theoryMarks: 100,
    practicalMarks: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    try {
      setLoading(true)
      const data = await getAllSubjects()
      console.log('Fetched subjects data:', data)
      setSubjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setSelectedSubject(null)
    setFormData({
      name: '',
      code: '',
      description: '',
      category: 'Core',
      creditHours: 3,
      fullMarks: 100,
      passMarks: 40,
      hasTheory: true,
      hasPractical: false,
      theoryMarks: 100,
      practicalMarks: 0,
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(subject: Subject) {
    setSelectedSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
      category: subject.category || 'Core',
      creditHours: subject.creditHours,
      fullMarks: subject.fullMarks,
      passMarks: subject.passMarks,
      hasTheory: subject.hasTheory,
      hasPractical: subject.hasPractical,
      theoryMarks: subject.theoryMarks || 0,
      practicalMarks: subject.practicalMarks || 0,
      isActive: subject.isActive,
    })
    setIsDialogOpen(true)
  }

  function openDeleteDialog(subject: Subject) {
    setSelectedSubject(subject)
    setIsDeleteDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (selectedSubject) {
        await updateSubject({ id: selectedSubject.id, ...formData })
        addMessage('Subject updated successfully', 'success')
      } else {
        await createSubject(formData)
        addMessage('Subject created successfully', 'success')
      }
      setIsDialogOpen(false)
      fetchSubjects()
    } catch (error) {
      const err = error as { message?: string };
      addMessage(err.message || 'Failed to save subject', 'error')
    }
  }

  async function handleDelete() {
    if (!selectedSubject) return

    try {
      await deleteSubject(selectedSubject.id)
      addMessage('Subject deleted successfully', 'success')
      setIsDeleteDialogOpen(false)
      fetchSubjects()
    } catch (error) {
      const err = error as { message?: string };
      addMessage(err.message || 'Failed to delete subject', 'error')
    }
  }

  // Advanced filtering with search and memoization
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      // Search filter
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !s.code.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (filterCategory !== 'all' && s.category !== filterCategory) return false
      
      // Status filter
      if (filterActive === 'active' && !s.isActive) return false
      if (filterActive === 'inactive' && s.isActive) return false
      
      return true
    })
  }, [subjects, searchQuery, filterCategory, filterActive])

  // Statistics
  const stats = useMemo(() => ({
    total: subjects.length,
    active: subjects.filter(s => s.isActive).length,
    inactive: subjects.filter(s => !s.isActive).length,
    totalCredits: subjects.reduce((sum, s) => sum + (s.creditHours || 0), 0)
  }), [subjects])

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
            <BookOpen className="w-10 h-10 text-accent-primary" />
            Subject Management
          </h1>
          <p className="text-fg-premium-muted mt-2 text-lg">
            Manage subjects, courses, and their configurations
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={openCreateDialog} size="lg" className="shadow-lg shadow-accent-primary/30 bg-gradient-to-r from-accent-primary to-accent-secondary border-0 text-white hover:opacity-90 hover:shadow-xl hover:shadow-accent-secondary/40 transition-all">
            <Plus className="mr-2 h-5 w-5" /> Create Subject
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
            title: 'Total Subjects',
            value: stats.total,
            icon: BookOpen,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10'
          },
          {
            title: 'Active Subjects',
            value: stats.active,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10'
          },
          {
            title: 'Inactive Subjects',
            value: stats.inactive,
            icon: XCircle,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500/10'
          },
          {
            title: 'Total Credits',
            value: stats.totalCredits,
            icon: Award,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10'
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
                    <p className="text-sm font-medium text-fg-premium-muted">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 text-fg-premium">
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
            <CardTitle className="flex items-center gap-2 text-fg-premium">
              <Filter className="h-5 w-5 text-accent-primary" />
              Search & Filters
            </CardTitle>
            <CardDescription className="text-fg-premium-muted">Find and filter subjects quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fg-premium-muted" />
                <Input
                  placeholder="Search by subject name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary transition-colors placeholder:text-white/20"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 flex-wrap">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px] border-white/10 bg-white/5 text-fg-premium">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-fg-premium">
                    <SelectItem value="all">All Categories</SelectItem>
                    {SUBJECT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterActive} onValueChange={setFilterActive}>
                  <SelectTrigger className="w-[150px] border-white/10 bg-white/5 text-fg-premium">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-fg-premium">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterCategory('all')
                    setFilterActive('all')
                  }}
                  className="gap-2 border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-fg-premium-muted">
              <span>
                Showing <span className="font-semibold text-accent-primary">{filteredSubjects.length}</span> of{' '}
                <span className="font-semibold">{subjects.length}</span> subjects
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white">
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white">
                  <Upload className="h-4 w-4" /> Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subjects Table */}
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
            ) : filteredSubjects.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen className="mx-auto h-16 w-16 text-white/20 mb-4" />
                <p className="text-fg-premium text-lg font-medium">No subjects found</p>
                <p className="text-fg-premium-muted text-sm mt-2">
                  {searchQuery || filterCategory !== 'all' || filterActive !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first subject to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/5 hover:bg-white/10 border-white/10">
                      <TableHead className="font-semibold text-fg-premium">Subject Name</TableHead>
                      <TableHead className="font-semibold text-fg-premium">Code</TableHead>
                      <TableHead className="font-semibold text-fg-premium">Category</TableHead>
                      <TableHead className="font-semibold text-fg-premium">Credits</TableHead>
                      <TableHead className="font-semibold text-fg-premium">Full Marks</TableHead>
                      <TableHead className="font-semibold text-fg-premium">Type</TableHead>
                      <TableHead className="font-semibold text-fg-premium">Status</TableHead>
                      <TableHead className="text-right font-semibold w-[120px] text-fg-premium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredSubjects.map((subject, index) => (
                        <motion.tr
                          key={subject.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-white/5 transition-colors border-b border-white/5"
                        >
                          <TableCell className="font-medium text-fg-premium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold shadow-md">
                                {subject.name.charAt(0)}
                              </div>
                              <span className="group-hover:text-accent-primary transition-colors font-medium">
                                {subject.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono font-medium border-white/20 text-fg-premium">
                              {subject.code}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={
                                subject.category === 'Core' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                                subject.category === 'Elective' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                'bg-white/10 text-fg-premium hover:bg-white/20'
                              }
                            >
                              {subject.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-fg-premium">
                              <Award className="h-4 w-4 text-fg-premium-muted" />
                              <span className="font-medium">{subject.creditHours}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-fg-premium">
                              <FileText className="h-4 w-4 text-fg-premium-muted" />
                              <span>{subject.fullMarks}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {subject.hasTheory && (
                                <Badge variant="outline" className="text-xs border-white/20 text-fg-premium">Theory</Badge>
                              )}
                              {subject.hasPractical && (
                                <Badge variant="outline" className="text-xs border-white/20 text-fg-premium">Practical</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant={subject.isActive ? 'default' : 'secondary'}
                                className={subject.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'}
                              >
                                {subject.isActive ? (
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
                                onClick={() => openEditDialog(subject)}
                                className="hover:bg-accent-primary/10 hover:text-accent-primary text-fg-premium-muted"
                              >
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(subject)}
                                className="hover:bg-red-500/10 hover:text-red-400 text-fg-premium-muted"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-bg-premium border-white/10 text-fg-premium">
          <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedSubject ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                {selectedSubject ? (
                  <Pencil className="h-6 w-6 text-blue-400" />
                ) : (
                  <Plus className="h-6 w-6 text-green-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-fg-premium">
                  {selectedSubject ? 'Edit Subject' : 'Create New Subject'}
                </DialogTitle>
                <DialogDescription className="text-base mt-1 text-fg-premium-muted">
                  {selectedSubject
                    ? 'Update subject information below'
                    : 'Add a new subject to your school management system'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-fg-premium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent-primary" /> Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Subject Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Mathematics"
                    required
                    className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                  />
                </div>

                <div>
                  <Label htmlFor="code" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Subject Code <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., MATH101"
                    required
                    className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20 font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Category <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="mt-2 border-white/10 bg-white/5 text-fg-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10 text-fg-premium">
                      {SUBJECT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="creditHours" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Credit Hours <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="creditHours"
                    type="number"
                    value={formData.creditHours}
                    onChange={(e) =>
                      setFormData({ ...formData, creditHours: parseInt(e.target.value) })
                    }
                    min={1}
                    required
                    className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Marks Configuration */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-fg-premium flex items-center gap-2">
                <Award className="h-4 w-4 text-accent-primary" /> Marks Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullMarks" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Full Marks <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="fullMarks"
                    type="number"
                    value={formData.fullMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, fullMarks: parseInt(e.target.value) })
                    }
                    min={1}
                    required
                    className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                  />
                </div>

                <div>
                  <Label htmlFor="passMarks" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Pass Marks <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="passMarks"
                    type="number"
                    value={formData.passMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, passMarks: parseInt(e.target.value) })
                    }
                    min={1}
                    required
                    className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                  />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <input
                    type="checkbox"
                    id="hasTheory"
                    checked={formData.hasTheory}
                    onChange={(e) =>
                      setFormData({ ...formData, hasTheory: e.target.checked })
                    }
                    className="h-4 w-4 text-accent-primary rounded border-white/20 bg-white/10 focus:ring-accent-primary"
                  />
                  <Label htmlFor="hasTheory" className="text-sm font-medium cursor-pointer text-fg-premium">Has Theory Component</Label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <input
                    type="checkbox"
                    id="hasPractical"
                    checked={formData.hasPractical}
                    onChange={(e) =>
                      setFormData({ ...formData, hasPractical: e.target.checked })
                    }
                    className="h-4 w-4 text-accent-primary rounded border-white/20 bg-white/10 focus:ring-accent-primary"
                  />
                  <Label htmlFor="hasPractical" className="text-sm font-medium cursor-pointer text-fg-premium">Has Practical Component</Label>
                </div>

                {formData.hasTheory && (
                  <div>
                    <Label htmlFor="theoryMarks" className="text-sm font-semibold text-fg-premium">Theory Marks</Label>
                    <Input
                      id="theoryMarks"
                      type="number"
                      value={formData.theoryMarks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          theoryMarks: parseInt(e.target.value),
                        })
                      }
                      min={0}
                      className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                    />
                  </div>
                )}

                {formData.hasPractical && (
                  <div>
                    <Label htmlFor="practicalMarks" className="text-sm font-semibold text-fg-premium">Practical Marks</Label>
                    <Input
                      id="practicalMarks"
                      type="number"
                      value={formData.practicalMarks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          practicalMarks: parseInt(e.target.value),
                        })
                      }
                      min={0}
                      className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-fg-premium flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent-primary" /> Additional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-fg-premium">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional subject description"
                    rows={3}
                    className="mt-2 border-white/10 bg-white/5 text-fg-premium focus:border-accent-primary focus:ring-accent-primary/20"
                  />
                </div>

                <div>
                  <Label htmlFor="isActive" className="text-sm font-semibold text-fg-premium flex items-center gap-1">
                    Status <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.isActive ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isActive: value === 'true' })
                    }
                  >
                    <SelectTrigger className="mt-2 border-white/10 bg-white/5 text-fg-premium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10 text-fg-premium">
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
            </div>

            <DialogFooter className="bg-white/5 -mx-6 -mb-6 px-6 py-4 mt-8 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-white/10 border-white/10 text-fg-premium"
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white border-0">
                {selectedSubject ? (
                  <><CheckCircle2 className="h-4 w-4" /> Update Subject</>
                ) : (
                  <><Plus className="h-4 w-4" /> Create Subject</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-bg-premium border-white/10 text-fg-premium">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2 text-xl">
              <Trash2 className="h-6 w-6" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-base pt-2 text-fg-premium-muted">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-fg-premium">
                {selectedSubject?.name}
              </span>
              ? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 hover:bg-white/10 text-fg-premium"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2 bg-red-500 hover:bg-red-600">
              <Trash2 className="h-4 w-4" /> Delete Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}