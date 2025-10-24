'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { School } from '@/lib/school-api'
import { useSchoolInfo } from '@/hooks/useSchoolInfo'

interface SchoolContextType {
  school: School | null
  loading: boolean
  error: string | null
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined)

export function SchoolProvider({ children }: { children: ReactNode }) {
  const { school, loading, error } = useSchoolInfo()

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
