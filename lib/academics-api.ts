const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ==================== TYPES ====================

export interface Class {
  id: string
  name: string
  slug: string
  grade: number
  section: string | null
  capacity: number
  academicYear: string
  isActive: boolean
  description: string | null
  createdAt: string
  updatedAt: string
  subjects?: ClassSubject[]
}

export interface Subject {
  id: string
  name: string
  slug: string
  code: string
  description: string | null
  category: string | null
  creditHours: number
  fullMarks: number
  passMarks: number
  hasTheory: boolean
  hasPractical: boolean
  theoryMarks: number | null
  practicalMarks: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  classes?: ClassSubject[]
}

export interface ClassSubject {
  id: string
  classId: string
  subjectId: string
  isCompulsory: boolean
  weeklyPeriods: number
  subject?: Subject
  class?: Class
}

export interface CreateClassDto {
  name: string
  grade: number
  section?: string
  capacity?: number
  academicYear: string
  description?: string
  isActive?: boolean
}

export interface UpdateClassDto {
  id: string
  name?: string
  grade?: number
  section?: string
  capacity?: number
  academicYear?: string
  description?: string
  isActive?: boolean
}

export interface CreateSubjectDto {
  name: string
  code: string
  description?: string
  category?: string
  creditHours?: number
  fullMarks?: number
  passMarks?: number
  hasTheory?: boolean
  hasPractical?: boolean
  theoryMarks?: number
  practicalMarks?: number
  isActive?: boolean
}

export interface UpdateSubjectDto {
  id: string
  name?: string
  code?: string
  description?: string
  category?: string
  creditHours?: number
  fullMarks?: number
  passMarks?: number
  hasTheory?: boolean
  hasPractical?: boolean
  theoryMarks?: number
  practicalMarks?: number
  isActive?: boolean
}

export interface AssignSubjectsDto {
  subjects: {
    subjectId: string
    isCompulsory?: boolean
    weeklyPeriods?: number
  }[]
}

// ==================== CLASS API ====================

export async function createClass(data: CreateClassDto) {
  const response = await fetch(`${API_BASE_URL}/academics/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create class')
  }

  return response.json()
}

export async function getAllClasses(academicYear?: string, isActive?: boolean) {
  const params = new URLSearchParams()
  if (academicYear) params.append('academicYear', academicYear)
  if (isActive !== undefined) params.append('isActive', String(isActive))

  const url = `${API_BASE_URL}/academics/classes?${params.toString()}`
  console.log('Fetching classes from:', url)

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  console.log('Classes response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Classes fetch error:', errorText)
    throw new Error('Failed to fetch classes')
  }

  const data = await response.json()
  console.log('Classes raw response:', data)
  console.log('Is array?', Array.isArray(data))
  console.log('Data type:', typeof data)
  console.log('Data keys:', data ? Object.keys(data) : 'null')
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return data
  } else if (data && typeof data === 'object') {
    // Check if data is wrapped in common property names
    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data.classes)) return data.classes
    if (Array.isArray(data.results)) return data.results
    if (Array.isArray(data.items)) return data.items
  }
  
  return []
}

export async function getClassById(id: string) {
  const response = await fetch(`${API_BASE_URL}/academics/classes/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch class')
  }

  return response.json()
}

export async function updateClass(data: UpdateClassDto) {
  const { id, ...updateData } = data
  const response = await fetch(`${API_BASE_URL}/academics/classes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update class')
  }

  return response.json()
}

export async function deleteClass(id: string) {
  const response = await fetch(`${API_BASE_URL}/academics/classes/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete class')
  }

  return response.json()
}

// ==================== SUBJECT API ====================

export async function createSubject(data: CreateSubjectDto) {
  const response = await fetch(`${API_BASE_URL}/academics/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create subject')
  }

  return response.json()
}

export async function getAllSubjects(category?: string, isActive?: boolean) {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (isActive !== undefined) params.append('isActive', String(isActive))

  const url = `${API_BASE_URL}/academics/subjects?${params.toString()}`
  console.log('Fetching subjects from:', url)

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  console.log('Subjects response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Subjects fetch error:', errorText)
    throw new Error('Failed to fetch subjects')
  }

  const data = await response.json()
  console.log('Subjects raw response:', data)
  console.log('Is array?', Array.isArray(data))
  console.log('Data type:', typeof data)
  console.log('Data keys:', data ? Object.keys(data) : 'null')
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return data
  } else if (data && typeof data === 'object') {
    // Check if data is wrapped in common property names
    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data.subjects)) return data.subjects
    if (Array.isArray(data.results)) return data.results
    if (Array.isArray(data.items)) return data.items
  }
  
  return []
}

export async function getSubjectById(id: string) {
  const response = await fetch(`${API_BASE_URL}/academics/subjects/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch subject')
  }

  return response.json()
}

export async function updateSubject(data: UpdateSubjectDto) {
  const { id, ...updateData } = data
  const response = await fetch(`${API_BASE_URL}/academics/subjects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update subject')
  }

  return response.json()
}

export async function deleteSubject(id: string) {
  const response = await fetch(`${API_BASE_URL}/academics/subjects/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete subject')
  }

  return response.json()
}

// ==================== CLASS-SUBJECT ASSIGNMENT API ====================

export async function assignSubjectsToClass(classId: string, data: AssignSubjectsDto) {
  const response = await fetch(
    `${API_BASE_URL}/academics/classes/${classId}/subjects`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to assign subjects')
  }

  return response.json()
}

export async function getClassSubjects(classId: string) {
  const response = await fetch(
    `${API_BASE_URL}/academics/classes/${classId}/subjects`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch class subjects')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}
