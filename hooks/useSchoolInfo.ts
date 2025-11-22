'use client'

import { useEffect, useState } from 'react'
import { getSchoolInfo, School } from '@/lib/school-api'

/**
 * Hook to fetch and manage school information from API
 * 
 * @deprecated For landing page, use static SCHOOL_INFO from @/lib/constants/school-info instead
 * This hook is only for authenticated admin routes that need dynamic/editable school data
 * 
 * Returns the school data and loading state
 */
export function useSchoolInfo() {
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSchool() {
      try {
        setLoading(true)
        const data = await getSchoolInfo()
        setSchool(data)
        setError(null)
      } catch (err) {
        console.error('Error in useSchoolInfo:', err)
        setError('Failed to load school information')
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [])

  return { school, loading, error }
}
