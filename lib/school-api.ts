const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface School {
  id: string
  name: string
  tagline: string
  motto: string
  address: string
  city: string
  phone: string
  email: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  description: string
  mission: string
  vision: string
  heroTitle: string
  heroSubtitle: string
  heroCTA: string
  createdAt: string
  updatedAt: string
}

export interface SchoolResponse {
  message: string
  school: School | null
}

/**
 * Fetch school information from the API
 * This is a public endpoint - no authentication required
 */
export async function getSchoolInfo(): Promise<School | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/academics/school`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache for now to ensure fresh data
    })

    if (!response.ok) {
      console.error('Failed to fetch school info:', response.status)
      return null
    }

    const data: SchoolResponse = await response.json()
    return data.school
  } catch (error) {
    console.error('Error fetching school info:', error)
    return null
  }
}

/**
 * Update school information (Admin only)
 */
export async function updateSchoolInfo(schoolData: Partial<School> & { id: string }): Promise<SchoolResponse> {
  const response = await fetch(`${API_BASE_URL}/academics/update-school`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(schoolData),
  })

  if (!response.ok) {
    throw new Error('Failed to update school info')
  }

  return response.json()
}
