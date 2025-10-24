'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      } else {
        await createSubject(formData)
      }
      setIsDialogOpen(false)
      fetchSubjects()
    } catch (error: any) {
      alert(error.message || 'Failed to save subject')
    }
  }

  async function handleDelete() {
    if (!selectedSubject) return

    try {
      await deleteSubject(selectedSubject.id)
      setIsDeleteDialogOpen(false)
      fetchSubjects()
    } catch (error: any) {
      alert(error.message || 'Failed to delete subject')
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
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Subject Management
          </h1>
          <p className="text-slate-600 mt-2">
            Manage subjects, courses, and their configurations
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={openCreateDialog} size="lg" className="shadow-lg">
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
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Active Subjects',
            value: stats.active,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Inactive Subjects',
            value: stats.inactive,
            icon: XCircle,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            title: 'Total Credits',
            value: stats.totalCredits,
            icon: Award,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
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
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} strokeWidth={2} />
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
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              Search & Filters
            </CardTitle>
            <CardDescription>Find and filter subjects quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by subject name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 flex-wrap">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {SUBJECT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterActive} onValueChange={setFilterActive}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
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
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                Showing <span className="font-semibold text-purple-600">{filteredSubjects.length}</span> of{' '}
                <span className="font-semibold">{subjects.length}</span> subjects
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
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
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="p-16 text-center">
                <BookOpen className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg font-medium">No subjects found</p>
                <p className="text-slate-400 text-sm mt-2">
                  {searchQuery || filterCategory !== 'all' || filterActive !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first subject to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold">Subject Name</TableHead>
                      <TableHead className="font-semibold">Code</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Credits</TableHead>
                      <TableHead className="font-semibold">Full Marks</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold w-[120px]">Actions</TableHead>
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
                          className="group hover:bg-purple-50 transition-colors border-b"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                {subject.name.charAt(0)}
                              </div>
                              <span className="group-hover:text-purple-600 transition-colors font-medium">
                                {subject.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono font-medium">
                              {subject.code}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={
                                subject.category === 'Core' ? 'bg-blue-100 text-blue-700' :
                                subject.category === 'Elective' ? 'bg-green-100 text-green-700' :
                                'bg-slate-100 text-slate-700'
                              }
                            >
                              {subject.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-slate-400" />
                              <span className="font-medium">{subject.creditHours}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-400" />
                              <span>{subject.fullMarks}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {subject.hasTheory && (
                                <Badge variant="outline" className="text-xs">Theory</Badge>
                              )}
                              {subject.hasPractical && (
                                <Badge variant="outline" className="text-xs">Practical</Badge>
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
                                className={subject.isActive ? 'bg-green-500 hover:bg-green-600 shadow-sm' : ''}
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
                                className="hover:bg-purple-100 hover:text-purple-700"
                              >
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(subject)}
                                className="hover:bg-red-50 hover:text-red-600"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedSubject ? 'bg-purple-100' : 'bg-green-100'}`}>
                {selectedSubject ? (
                  <Pencil className="h-6 w-6 text-purple-600" />
                ) : (
                  <Plus className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {selectedSubject ? 'Edit Subject' : 'Create New Subject'}
                </DialogTitle>
                <DialogDescription className="text-base mt-1">
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
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" /> Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Subject Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Mathematics"
                    required
                    className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="code" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Subject Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., MATH101"
                    required
                    className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="mt-2 border-slate-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {SUBJECT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="creditHours" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Credit Hours <span className="text-red-500">*</span>
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
                    className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Marks Configuration */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" /> Marks Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullMarks" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Full Marks <span className="text-red-500">*</span>
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
                    className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="passMarks" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Pass Marks <span className="text-red-500">*</span>
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
                    className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="hasTheory"
                    checked={formData.hasTheory}
                    onChange={(e) =>
                      setFormData({ ...formData, hasTheory: e.target.checked })
                    }
                    className="h-4 w-4 text-purple-600"
                  />
                  <Label htmlFor="hasTheory" className="text-sm font-medium cursor-pointer">Has Theory Component</Label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="hasPractical"
                    checked={formData.hasPractical}
                    onChange={(e) =>
                      setFormData({ ...formData, hasPractical: e.target.checked })
                    }
                    className="h-4 w-4 text-purple-600"
                  />
                  <Label htmlFor="hasPractical" className="text-sm font-medium cursor-pointer">Has Practical Component</Label>
                </div>

                {formData.hasTheory && (
                  <div>
                    <Label htmlFor="theoryMarks" className="text-sm font-semibold text-slate-700">Theory Marks</Label>
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
                      className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}

                {formData.hasPractical && (
                  <div>
                    <Label htmlFor="practicalMarks" className="text-sm font-semibold text-slate-700">Practical Marks</Label>
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
                      className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" /> Additional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional subject description"
                    rows={3}
                    className="mt-2 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="isActive" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.isActive ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isActive: value === 'true' })
                    }
                  >
                    <SelectTrigger className="mt-2 border-slate-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" /> Active
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-slate-400" /> Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 mt-8 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-white"
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2 bg-purple-600 hover:bg-purple-700">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2 text-xl">
              <Trash2 className="h-6 w-6" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900">
                {selectedSubject?.name}
              </span>
              ? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}