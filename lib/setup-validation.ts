import { api } from './api-client'
import { SCHOOL_INFO } from './constants/school-info'

/**
 * Validation functions to check if setup steps are actually completed
 * These functions verify that the required data exists before allowing step completion
 */

export interface ValidationResult {
  isValid: boolean
  message: string
  details?: string[]
}

/**
 * Step 1: Validate School Information Setup
 * Checks if all required school information fields are filled
 */
export async function validateSchoolInfoSetup(): Promise<ValidationResult> {
  try {
    // Check if critical fields are not default/empty values
    const requiredFields = [
      { field: 'name', value: SCHOOL_INFO.name },
      { field: 'address', value: SCHOOL_INFO.contact.address },
      { field: 'phone', value: SCHOOL_INFO.contact.phone },
      { field: 'email', value: SCHOOL_INFO.contact.email },
    ]

    const emptyFields = requiredFields.filter(
      ({ value }) => !value || value.trim() === ''
    )

    if (emptyFields.length > 0) {
      return {
        isValid: false,
        message: 'Please complete all required school information fields',
        details: emptyFields.map(({ field }) => `${field} is required`),
      }
    }

    return {
      isValid: true,
      message: 'School information is complete',
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate school information',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Step 2: Validate Classes Creation
 * Checks if at least one class has been created
 */
export async function validateClassesCreated(): Promise<ValidationResult> {
  try {
    // TODO: Replace with actual API call when available
    // const response = await api.get('/classes')
    // const classCount = response.data?.length || 0
    
    // Simulated check - replace with actual API call
    const classCount = 0 // This should come from your API
    
    if (classCount === 0) {
      return {
        isValid: false,
        message: 'No classes found',
        details: ['Please create at least one class before proceeding'],
      }
    }

    return {
      isValid: true,
      message: `${classCount} class(es) created successfully`,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate classes',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Step 3: Validate Subjects Creation
 * Checks if at least one subject has been created
 */
export async function validateSubjectsCreated(): Promise<ValidationResult> {
  try {
    // TODO: Replace with actual API call when available
    // const response = await api.get('/subjects')
    // const subjectCount = response.data?.length || 0
    
    const subjectCount = 0 // This should come from your API
    
    if (subjectCount === 0) {
      return {
        isValid: false,
        message: 'No subjects found',
        details: ['Please create at least one subject before proceeding'],
      }
    }

    return {
      isValid: true,
      message: `${subjectCount} subject(s) created successfully`,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate subjects',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Step 4: Validate Teachers Creation
 * Checks if at least one teacher has been created
 */
export async function validateTeachersCreated(): Promise<ValidationResult> {
  try {
    // TODO: Replace with actual API call when available
    // const response = await api.get('/teachers')
    // const teacherCount = response.data?.length || 0
    
    const teacherCount = 0 // This should come from your API
    
    if (teacherCount === 0) {
      return {
        isValid: false,
        message: 'No teachers found',
        details: ['Please add at least one teacher profile before proceeding'],
      }
    }

    return {
      isValid: true,
      message: `${teacherCount} teacher(s) added successfully`,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate teachers',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Step 5: Validate Students Creation
 * Checks if at least one student has been created
 */
export async function validateStudentsCreated(): Promise<ValidationResult> {
  try {
    // TODO: Replace with actual API call when available
    // const response = await api.get('/students')
    // const studentCount = response.data?.length || 0
    
    const studentCount = 0 // This should come from your API
    
    if (studentCount === 0) {
      return {
        isValid: false,
        message: 'No students found',
        details: ['Please add at least one student profile before proceeding'],
      }
    }

    return {
      isValid: true,
      message: `${studentCount} student(s) enrolled successfully`,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate students',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Step 6: Validate Complete Setup
 * Checks if all previous steps are properly completed
 */
export async function validateCompleteSetup(): Promise<ValidationResult> {
  try {
    const validations = await Promise.all([
      validateSchoolInfoSetup(),
      validateClassesCreated(),
      validateSubjectsCreated(),
      validateTeachersCreated(),
      validateStudentsCreated(),
    ])

    const failedValidations = validations.filter((v) => !v.isValid)

    if (failedValidations.length > 0) {
      return {
        isValid: false,
        message: 'Some setup steps are incomplete',
        details: failedValidations.map((v) => v.message),
      }
    }

    return {
      isValid: true,
      message: 'All setup steps completed successfully',
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Failed to validate complete setup',
      details: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

/**
 * Main validation function that routes to the appropriate validator
 */
export async function validateStep(stepId: number): Promise<ValidationResult> {
  switch (stepId) {
    case 1:
      return validateSchoolInfoSetup()
    case 2:
      return validateClassesCreated()
    case 3:
      return validateSubjectsCreated()
    case 4:
      return validateTeachersCreated()
    case 5:
      return validateStudentsCreated()
    case 6:
      return validateCompleteSetup()
    default:
      return {
        isValid: false,
        message: 'Invalid step ID',
      }
  }
}

/**
 * Check if user is trying to skip steps
 */
export function checkStepSequence(
  currentStepId: number,
  completedSteps: number[]
): ValidationResult {
  // Step 1 is always accessible
  if (currentStepId === 1) {
    return { isValid: true, message: 'Step 1 is always accessible' }
  }

  // Check if all previous steps are completed
  for (let i = 1; i < currentStepId; i++) {
    if (!completedSteps.includes(i)) {
      return {
        isValid: false,
        message: `Cannot proceed to Step ${currentStepId}`,
        details: [
          `You must complete Step ${i} first`,
          'Please follow the sequential order',
        ],
      }
    }
  }

  return { isValid: true, message: 'Step sequence is valid' }
}
