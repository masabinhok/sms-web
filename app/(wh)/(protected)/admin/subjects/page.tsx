'use client'

import { useState, useEffect } from 'react'
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
import { Plus, Pencil, Trash2, Filter, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SUBJECT_CATEGORIES = ['Core', 'Elective', 'Extra-curricular', 'Other']

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
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

  const filteredSubjects = subjects.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false
    if (filterActive === 'active' && !s.isActive) return false
    if (filterActive === 'inactive' && s.isActive) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subject Management</h1>
          <p className="text-gray-600">Manage subjects and their configurations</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Create Subject
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label>Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {SUBJECT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label>Status</Label>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading subjects...</div>
          ) : filteredSubjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No subjects found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        {subject.name}
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
                    <TableCell>{subject.creditHours}</TableCell>
                    <TableCell>
                      {subject.fullMarks} / {subject.passMarks}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {subject.hasTheory && (
                          <Badge variant="secondary" className="text-xs">
                            Theory
                          </Badge>
                        )}
                        {subject.hasPractical && (
                          <Badge variant="secondary" className="text-xs">
                            Practical
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                        {subject.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(subject)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(subject)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSubject ? 'Edit Subject' : 'Create New Subject'}
            </DialogTitle>
            <DialogDescription>
              {selectedSubject
                ? 'Update subject information'
                : 'Add a new subject to the system'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div>
                <Label htmlFor="code">Subject Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., MATH101"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="creditHours">Credit Hours *</Label>
                <Input
                  id="creditHours"
                  type="number"
                  value={formData.creditHours}
                  onChange={(e) =>
                    setFormData({ ...formData, creditHours: parseInt(e.target.value) })
                  }
                  min={1}
                  required
                />
              </div>
            </div>

            {/* Marks Configuration */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Marks Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullMarks">Full Marks *</Label>
                  <Input
                    id="fullMarks"
                    type="number"
                    value={formData.fullMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, fullMarks: parseInt(e.target.value) })
                    }
                    min={1}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="passMarks">Pass Marks *</Label>
                  <Input
                    id="passMarks"
                    type="number"
                    value={formData.passMarks}
                    onChange={(e) =>
                      setFormData({ ...formData, passMarks: parseInt(e.target.value) })
                    }
                    min={1}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasTheory"
                    checked={formData.hasTheory}
                    onChange={(e) =>
                      setFormData({ ...formData, hasTheory: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hasTheory">Has Theory Component</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasPractical"
                    checked={formData.hasPractical}
                    onChange={(e) =>
                      setFormData({ ...formData, hasPractical: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hasPractical">Has Practical Component</Label>
                </div>

                {formData.hasTheory && (
                  <div>
                    <Label htmlFor="theoryMarks">Theory Marks</Label>
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
                    />
                  </div>
                )}

                {formData.hasPractical && (
                  <div>
                    <Label htmlFor="practicalMarks">Practical Marks</Label>
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
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional subject description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="isActive">Status *</Label>
              <Select
                value={formData.isActive ? 'true' : 'false'}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value === 'true' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedSubject?.name}&quot;? This
              action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}