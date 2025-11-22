'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { SCHOOL_INFO } from '@/lib/constants/school-info'

interface SchoolContextType {
  school: typeof SCHOOL_INFO
  loading: boolean
  error: string | null
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined)

/**
 * SchoolProvider - Client-side only provider
 * 
 * This provider uses static JSON data for the landing page.
 * No API calls are made - all school information is loaded from local constants.
 * Database/API access only begins from authenticated routes (login/dashboard).
 */
export function SchoolProvider({ children }: { children: ReactNode }) {
  // Static data - no API calls
  const school = SCHOOL_INFO
  const loading = false
  const error = null

  return (
    <SchoolContext.Provider value={{ school, loading, error }}>
      {children}
    </SchoolContext.Provider>
  )
}

export function useSchool() {
  const context = useContext(SchoolContext)
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider')
  }
  return context
}
