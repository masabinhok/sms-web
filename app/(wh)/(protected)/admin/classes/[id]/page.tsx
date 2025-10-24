'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  getClassById,
  getAllSubjects,
  assignSubjectsToClass,
  getClassSubjects,
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
import { ArrowLeft, Plus, BookOpen, X } from 'lucide-react'

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string

  const [classData, setClassData] = useState<Class | null>(null)
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
      alert('All subjects have been assigned to this class')
      return
    }

    setSelectedSubjects([])
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
      alert('Please select at least one subject')
      return
    }

    try {
      await assignSubjectsToClass(classId, { subjects: selectedSubjects })
      setIsDialogOpen(false)
      fetchData()
    } catch (error: any) {
      alert(error.message || 'Failed to assign subjects')
    }
  }

  const assignedIds = new Set(classSubjects.map((cs) => cs.subjectId))
  const selectedIds = new Set(selectedSubjects.map((s) => s.subjectId))
  const availableSubjects = allSubjects.filter(
    (s) => !assignedIds.has(s.id) && !selectedIds.has(s.id)
  )

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!classData) {
    return <div className="p-8 text-center">Class not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{classData.name}</h1>
            <p className="text-gray-600">
              Grade {classData.grade} • {classData.academicYear}
            </p>
          </div>
        </div>
        <Badge variant={classData.isActive ? 'default' : 'secondary'}>
          {classData.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Class Info */}
      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Section</p>
            <p className="font-medium">{classData.section || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capacity</p>
            <p className="font-medium">{classData.capacity} students</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Academic Year</p>
            <p className="font-medium">{classData.academicYear}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Slug</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {classData.slug}
            </code>
          </div>
          {classData.description && (
            <div className="col-span-full">
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{classData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assigned Subjects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Assigned Subjects</CardTitle>
            <CardDescription>
              {classSubjects.length} subject(s) assigned to this class
            </CardDescription>
          </div>
          <Button onClick={openAssignDialog}>
            <Plus className="mr-2 h-4 w-4" /> Assign Subjects
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {classSubjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No subjects assigned yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Weekly Periods</TableHead>
                  <TableHead>Full Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classSubjects.map((cs) => {
                  const subject = allSubjects.find((s) => s.id === cs.subjectId)
                  if (!subject) return null

                  return (
                    <TableRow key={cs.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          {subject.name}
                          {cs.isCompulsory && (
                            <Badge variant="default" className="text-xs">
                              Compulsory
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {subject.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subject.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {subject.hasTheory && (
                            <Badge variant="secondary" className="text-xs">
                              T
                            </Badge>
                          )}
                          {subject.hasPractical && (
                            <Badge variant="secondary" className="text-xs">
                              P
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{cs.weeklyPeriods}</TableCell>
                      <TableCell>{subject.fullMarks}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assign Subjects Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Subjects to {classData.name}</DialogTitle>
            <DialogDescription>
              Select subjects and configure their settings for this class
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedSubjects.map((selected, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label>Subject</Label>
                      <Select
                        value={selected.subjectId}
                        onValueChange={(value) =>
                          updateSubjectSelection(index, 'subjectId', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSubjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-32">
                      <Label>Type</Label>
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Compulsory</SelectItem>
                          <SelectItem value="false">Elective</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-32">
                      <Label>Weekly Periods</Label>
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
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubjectFromSelection(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {availableSubjects.length > 0 && (
              <Button
                variant="outline"
                onClick={addSubjectToSelection}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Subject
              </Button>
            )}

            {selectedSubjects.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Click the button below to start adding subjects
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubjects} disabled={selectedSubjects.length === 0}>
              Assign {selectedSubjects.length} Subject(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
