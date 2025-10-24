'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Plus, Pencil, Trash2, Eye, Filter, Search, GraduationCap, Users, Calendar, CheckCircle2, XCircle, MoreVertical, Download, Upload, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ClassManagementPage() {
  const router = useRouter()
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
      } else {
        await createClass(formData)
      }
      setIsDialogOpen(false)
      fetchClasses()
    } catch (error: any) {
      alert(error.message || 'Failed to save class')
    }
  }

  async function handleDelete() {
    if (!selectedClass) return

    try {
      await deleteClass(selectedClass.id)
      setIsDeleteDialogOpen(false)
      fetchClasses()
    } catch (error: any) {
      alert(error.message || 'Failed to delete class')
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
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Class Management
          </h1>
          <p className="text-slate-600 mt-2">
            Manage classes, sections, and academic years with ease
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={openCreateDialog} size="lg" className="shadow-lg">
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
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Active Classes',
            value: stats.active,
            icon: CheckCircle2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Inactive Classes',
            value: stats.inactive,
            icon: XCircle,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            title: 'Total Capacity',
            value: stats.totalCapacity,
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50'
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
              <Filter className="h-5 w-5 text-blue-600" />
              Search & Filters
            </CardTitle>
            <CardDescription>Find and filter classes quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by class name or section..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 flex-wrap">
                <Select value={filterGrade} onValueChange={setFilterGrade}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
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
                    setFilterGrade('all')
                    setFilterYear('all')
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
                Showing <span className="font-semibold text-blue-600">{filteredClasses.length}</span> of{' '}
                <span className="font-semibold">{classes.length}</span> classes
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

      {/* Classes Table */}
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
            ) : filteredClasses.length === 0 ? (
              <div className="p-16 text-center">
                <GraduationCap className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg font-medium">No classes found</p>
                <p className="text-slate-400 text-sm mt-2">
                  {searchQuery || filterYear !== 'all' || filterActive !== 'all' || filterGrade !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first class to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold">Class Name</TableHead>
                      <TableHead className="font-semibold">Grade</TableHead>
                      <TableHead className="font-semibold">Section</TableHead>
                      <TableHead className="font-semibold">Capacity</TableHead>
                      <TableHead className="font-semibold">Academic Year</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
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
                          className="group hover:bg-blue-50 transition-colors border-b cursor-pointer"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                {classItem.name.charAt(0)}
                              </div>
                              <span className="group-hover:text-blue-600 transition-colors font-medium">
                                {classItem.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium">
                              Grade {classItem.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {classItem.section ? (
                              <Badge variant="secondary" className="font-medium">{classItem.section}</Badge>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-slate-400" />
                              <span className="font-medium">{classItem.capacity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
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
                                className={classItem.isActive ? 'bg-green-500 hover:bg-green-600 shadow-sm' : ''}
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
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white p-1">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/admin/classes/${classItem.id}`)}
                                    className="gap-2"
                                  >
                                    <Eye className="h-4 w-4" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(classItem)}
                                    className="gap-2"
                                  >
                                    <Pencil className="h-4 w-4" /> Edit Class
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(classItem)}
                                    className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" /> Delete Class
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedClass ? (
                <><Pencil className="h-6 w-6 text-blue-600" /> Edit Class</>
              ) : (
                <><Plus className="h-6 w-6 text-blue-600" /> Create New Class</>
              )}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedClass
                ? 'Update class information below'
                : 'Add a new class to your school management system'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Grade 5 - Section A"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="grade" className="text-base font-medium">
                  Grade <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.grade.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, grade: parseInt(value) })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section" className="text-base font-medium">Section</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  placeholder="e.g., A, B, C"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="capacity" className="text-base font-medium">
                  Capacity <span className="text-red-500">*</span>
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
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="academicYear" className="text-base font-medium">
                  Academic Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) =>
                    setFormData({ ...formData, academicYear: e.target.value })
                  }
                  placeholder="e.g., 2024"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="isActive" className="text-base font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.isActive ? 'true' : 'false'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === 'true' })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">✅ Active</SelectItem>
                    <SelectItem value="false">❌ Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional class description..."
                rows={3}
                className="mt-2"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                {selectedClass ? (
                  <><Pencil className="h-4 w-4" /> Update Class</>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2 text-xl">
              <Trash2 className="h-6 w-6" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900">
                {selectedClass?.name}
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
              <Trash2 className="h-4 w-4" /> Delete Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}