'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useMessage } from '@/store/messageStore'
import {
  getClassById,
  getAllSubjects,
  assignSubjectsToClass,
  getClassSubjects,
  removeSubjectFromClass,
  type Class,
  type Subject,
  type ClassSubject,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Plus, BookOpen, X, Users, Calendar, GraduationCap, CheckCircle2, XCircle, Award, FileText, Trash2 } from 'lucide-react'

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string
  const { addMessage } = useMessage()

  const [classData, setClassData] = useState<Class | null>(null)
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<
    { subjectId: string; isCompulsory: boolean; weeklyPeriods: number }[]
  >([])

  useEffect(() => {
    if (classId) {
      fetchData()
    }
  }, [classId])

  async function fetchData() {
    try {
      setLoading(true)
      const [classInfo, subjects, assignedSubjects] = await Promise.all([
        getClassById(classId),
        getAllSubjects(undefined, true),
        getClassSubjects(classId),
      ])
      setClassData(classInfo)
      setAllSubjects(Array.isArray(subjects) ? subjects : [])
      setClassSubjects(Array.isArray(assignedSubjects) ? assignedSubjects : [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setAllSubjects([])
      setClassSubjects([])
    } finally {
      setLoading(false)
    }
  }

  function openAssignDialog() {
    const assignedIds = new Set(classSubjects.map((cs) => cs.subjectId))
    const availableSubjects = allSubjects.filter((s) => !assignedIds.has(s.id))

    if (availableSubjects.length === 0) {
      addMessage('All subjects have been assigned to this class', 'warning')
      return
    }

    // Start with one empty selection
    setSelectedSubjects([
      {
        subjectId: availableSubjects[0].id,
        isCompulsory: true,
        weeklyPeriods: 5,
      },
    ])
    setIsDialogOpen(true)
  }

  function addSubjectToSelection() {
    const assignedIds = new Set(classSubjects.map((cs) => cs.subjectId))
    const selectedIds = new Set(selectedSubjects.map((s) => s.subjectId))
    const availableSubjects = allSubjects.filter(
      (s) => !assignedIds.has(s.id) && !selectedIds.has(s.id)
    )

    if (availableSubjects.length > 0) {
      setSelectedSubjects([
        ...selectedSubjects,
        {
          subjectId: availableSubjects[0].id,
          isCompulsory: true,
          weeklyPeriods: 5,
        },
      ])
    } else {
      addMessage('No more subjects available to add', 'warning')
    }
  }

  function removeSubjectFromSelection(index: number) {
    setSelectedSubjects(selectedSubjects.filter((_, i) => i !== index))
  }

  function updateSubjectSelection(
    index: number,
    field: 'subjectId' | 'isCompulsory' | 'weeklyPeriods',
    value: any
  ) {
    const updated = [...selectedSubjects]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedSubjects(updated)
  }

  async function handleAssignSubjects() {
    if (selectedSubjects.length === 0) {
      addMessage('Please select at least one subject', 'warning')
      return
    }

    // Validate all subjects have been selected
    const hasEmptySelection = selectedSubjects.some(s => !s.subjectId)
    if (hasEmptySelection) {
      addMessage('Please select a subject for all rows', 'warning')
      return
    }

    // Check for duplicate selections
    const subjectIds = selectedSubjects.map(s => s.subjectId)
    const uniqueIds = new Set(subjectIds)
    if (subjectIds.length !== uniqueIds.size) {
      addMessage('You have selected the same subject multiple times. Please select different subjects.', 'error')
      return
    }

    try {
      setSubmitting(true)
      console.log('Assigning subjects:', { subjects: selectedSubjects })
      
      const result = await assignSubjectsToClass(classId, { subjects: selectedSubjects })
      console.log('Assignment result:', result)
      
      setIsDialogOpen(false)
      setSelectedSubjects([])
      
      // Refresh the data
      await fetchData()
      
      const className = classData?.name || 'class'
      addMessage(`Successfully assigned ${selectedSubjects.length} subject(s) to ${className}!`, 'success')
    } catch (error: any) {
      console.error('Assignment error:', error)
      addMessage(error.message || 'Failed to assign subjects. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate available subjects dynamically
  const getAvailableSubjectsForIndex = (currentIndex: number) => {
    const assignedIds = new Set(classSubjects.map((cs) => cs.subjectId))
    const selectedIds = new Set(
      selectedSubjects
        .map((s, i) => i !== currentIndex ? s.subjectId : null)
        .filter(Boolean)
    )
    return allSubjects.filter(
      (s) => !assignedIds.has(s.id) && !selectedIds.has(s.id)
    )
  }

  async function handleRemoveSubject(subjectId: string, subjectName: string) {
    if (!confirm(`Are you sure you want to remove "${subjectName}" from this class?`)) {
      return
    }

    try {
      await removeSubjectFromClass(classId, subjectId)
      await fetchData()
      addMessage(`Successfully removed "${subjectName}" from ${classData?.name}!`, 'success')
    } catch (error: any) {
      console.error('Remove subject error:', error)
      addMessage(error.message || 'Failed to remove subject. Please try again.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Class not found</h2>
          <p className="text-slate-600 mb-6">The class you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Classes
            </Button>
            <Badge 
              variant={classData.isActive ? 'default' : 'secondary'}
              className={classData.isActive ? 'bg-green-100 text-green-800 border-green-200' : ''}
            >
              {classData.isActive ? (
                <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text  bg-gradient-to-r from-blue-600 to-blue-800">
                {classData.name}
              </h1>
              <p className="text-lg text-slate-600 mt-1">
                Grade {classData.grade} • Section {classData.section || 'N/A'}
              </p>
            </div>
          </div>

          {classData.description && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-slate-500 mt-1" />
                <p className="text-slate-700">{classData.description}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Capacity</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{classData.capacity}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Maximum students</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Academic Year</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{classData.academicYear}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Current session</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Grade Level</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{classData.grade}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Class grade</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Subjects</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{classSubjects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Assigned subjects</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>


        {/* Assigned Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Assigned Subjects
                </CardTitle>
                <CardDescription className="mt-1">
                  {classSubjects.length} subject(s) assigned to this class
                </CardDescription>
              </div>
              <Button onClick={openAssignDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Assign Subjects
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {classSubjects.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No subjects assigned yet</h3>
                  <p className="text-slate-600 mb-6">Get started by assigning subjects to this class</p>
                  <Button onClick={openAssignDialog} variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Assign Your First Subject
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                        <TableHead className="font-semibold text-slate-700">Code</TableHead>
                        <TableHead className="font-semibold text-slate-700">Category</TableHead>
                        <TableHead className="font-semibold text-slate-700">Type</TableHead>
                        <TableHead className="font-semibold text-slate-700">Weekly Periods</TableHead>
                        <TableHead className="font-semibold text-slate-700">Full Marks</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classSubjects.map((cs, index) => {
                        const subject = allSubjects.find((s) => s.id === cs.subjectId)
                        if (!subject) return null

                        return (
                          <motion.tr
                            key={cs.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50 transition-colors border-b border-slate-200"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{subject.name}</div>
                                  {cs.isCompulsory && (
                                    <Badge variant="default" className="text-xs mt-1 bg-green-100 text-green-800 border-green-200">
                                      Compulsory
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-700">
                                {subject.code}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-slate-300">
                                {subject.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {subject.hasTheory && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                    Theory
                                  </Badge>
                                )}
                                {subject.hasPractical && (
                                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                    Practical
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">{cs.weeklyPeriods}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">{subject.fullMarks}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveSubject(subject.id, subject.name)}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </Button>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Assign Subjects Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Assign Subjects to {classData.name}</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Select subjects and configure their settings for this class
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedSubjects.map((selected, index) => {
              const availableForThisRow = getAvailableSubjectsForIndex(index)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <Label className="text-slate-700 font-medium">Subject</Label>
                          <Select
                            value={selected.subjectId}
                            onValueChange={(value) =>
                              updateSubjectSelection(index, 'subjectId', value)
                            }
                          >
                            <SelectTrigger className="mt-1.5 bg-white border-slate-300">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-[200px]">
                              {availableForThisRow.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-slate-400" />
                                    {subject.name} ({subject.code})
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                      <div className="w-40">
                        <Label className="text-slate-700 font-medium">Type</Label>
                        <Select
                          value={selected.isCompulsory ? 'true' : 'false'}
                          onValueChange={(value) =>
                            updateSubjectSelection(
                              index,
                              'isCompulsory',
                              value === 'true'
                            )
                          }
                        >
                          <SelectTrigger className="mt-1.5 bg-white border-slate-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="true">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                Compulsory
                              </div>
                            </SelectItem>
                            <SelectItem value="false">
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-slate-400" />
                                Elective
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-36">
                        <Label className="text-slate-700 font-medium">Weekly Periods</Label>
                        <Input
                          type="number"
                          value={selected.weeklyPeriods}
                          onChange={(e) =>
                            updateSubjectSelection(
                              index,
                              'weeklyPeriods',
                              parseInt(e.target.value)
                            )
                          }
                          min={1}
                          className="mt-1.5 bg-white border-slate-300"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubjectFromSelection(index)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
            })}

            {(() => {
              const assignedIds = new Set(classSubjects.map((cs) => cs.subjectId))
              const selectedIds = new Set(selectedSubjects.map((s) => s.subjectId))
              const remainingSubjects = allSubjects.filter(
                (s) => !assignedIds.has(s.id) && !selectedIds.has(s.id)
              )
              
              return remainingSubjects.length > 0 && (
                <Button
                  variant="outline"
                  onClick={addSubjectToSelection}
                  className="w-full border-dashed border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another Subject ({remainingSubjects.length} available)
                </Button>
              )
            })()}

            {selectedSubjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No subjects selected</h3>
                <p className="text-slate-600 mb-6">Click the button below to start adding subjects</p>
                <Button onClick={addSubjectToSelection} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Subject
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedSubjects([])
              }} 
              className="hover:bg-white"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignSubjects} 
              disabled={selectedSubjects.length === 0 || submitting} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Assign {selectedSubjects.length} Subject(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
