import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { validateStep, type ValidationResult } from '@/lib/setup-validation'

export type StepStatus = 'completed' | 'in-progress' | 'pending'

export interface SetupStep {
  id: number
  status: StepStatus
  completedAt?: Date
  validatedAt?: Date
}

interface SetupState {
  steps: Record<number, SetupStep>
  
  // Actions
  markStepCompleted: (stepId: number) => Promise<ValidationResult>
  markStepInProgress: (stepId: number) => void
  markStepPending: (stepId: number) => void
  resetStep: (stepId: number) => void
  resetAllSteps: () => void
  
  // Getters
  getStepStatus: (stepId: number) => StepStatus
  isStepCompleted: (stepId: number) => boolean
  getCompletedStepsCount: () => number
  getTotalStepsCount: () => number
  getProgressPercentage: () => number
  canProceedToStep: (stepId: number) => boolean
  getCompletedStepIds: () => number[]
}

const TOTAL_STEPS = 6

const initialSteps: Record<number, SetupStep> = {
  1: { id: 1, status: 'in-progress' },
  2: { id: 2, status: 'pending' },
  3: { id: 3, status: 'pending' },
  4: { id: 4, status: 'pending' },
  5: { id: 5, status: 'pending' },
  6: { id: 6, status: 'pending' },
}

export const useSetupStore = create<SetupState>()(
  persist(
    (set, get) => ({
      steps: initialSteps,

      markStepCompleted: async (stepId: number): Promise<ValidationResult> => {
        // Check if previous steps are completed
        if (!get().canProceedToStep(stepId)) {
          return {
            isValid: false,
            message: 'Cannot complete this step yet',
            details: ['Please complete all previous steps first'],
          }
        }

        // Validate that the step requirements are actually met
        const validation = await validateStep(stepId)
        
        if (!validation.isValid) {
          return validation
        }

        // Mark as completed if validation passed
        set((state) => ({
          steps: {
            ...state.steps,
            [stepId]: {
              id: stepId,
              status: 'completed',
              completedAt: new Date(),
              validatedAt: new Date(),
            },
          },
        }))
        
        // Automatically mark next step as in-progress if it's pending
        const nextStepId = stepId + 1
        if (nextStepId <= TOTAL_STEPS) {
          const nextStep = get().steps[nextStepId]
          if (nextStep?.status === 'pending') {
            set((state) => ({
              steps: {
                ...state.steps,
                [nextStepId]: {
                  ...state.steps[nextStepId],
                  status: 'in-progress',
                },
              },
            }))
          }
        }

        return validation
      },

      markStepInProgress: (stepId: number) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [stepId]: {
              id: stepId,
              status: 'in-progress',
            },
          },
        }))
      },

      markStepPending: (stepId: number) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [stepId]: {
              id: stepId,
              status: 'pending',
            },
          },
        }))
      },

      resetStep: (stepId: number) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [stepId]: {
              id: stepId,
              status: 'pending',
            },
          },
        }))
      },

      resetAllSteps: () => {
        set({ steps: initialSteps })
      },

      getStepStatus: (stepId: number) => {
        return get().steps[stepId]?.status || 'pending'
      },

      isStepCompleted: (stepId: number) => {
        return get().steps[stepId]?.status === 'completed'
      },

      getCompletedStepsCount: () => {
        return Object.values(get().steps).filter((step) => step.status === 'completed').length
      },

      getTotalStepsCount: () => {
        return TOTAL_STEPS
      },

      getProgressPercentage: () => {
        const completed = get().getCompletedStepsCount()
        return Math.round((completed / TOTAL_STEPS) * 100)
      },

      canProceedToStep: (stepId: number) => {
        // Step 1 is always accessible
        if (stepId === 1) return true
        
        // For other steps, check if all previous steps are completed
        for (let i = 1; i < stepId; i++) {
          if (!get().isStepCompleted(i)) {
            return false
          }
        }
        return true
      },

      getCompletedStepIds: () => {
        return Object.values(get().steps)
          .filter((step) => step.status === 'completed')
          .map((step) => step.id)
      },
    }),
    {
      name: 'setup-storage',
      // Persist the entire steps object
      partialize: (state) => ({
        steps: state.steps,
      }),
    }
  )
)
