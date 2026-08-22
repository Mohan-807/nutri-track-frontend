import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateDailyTargets } from '../utils/nutrientTargets'

function buildProfile(input, previous) {
  const { heightCm, weightKg, age, gender, activityLevel, goal } = input
  const computed = calculateDailyTargets({ weightKg, heightCm, age, gender, activityLevel, goal })

  return {
    ...previous,
    heightCm,
    weightKg,
    age,
    gender,
    activityLevel,
    goal,
    onboardingCompleted: true,
    bmi: computed.bmi,
    bmr: computed.bmr,
    tdee: computed.tdee,
    targets: {
      calories: computed.calories,
      proteinG: computed.proteinG,
      carbsG: computed.carbsG,
      fatG: computed.fatG,
      fiberG: computed.fiberG,
      sugarMaxG: computed.sugarMaxG,
      sodiumMaxMg: computed.sodiumMaxMg,
    },
    updatedAt: new Date().toISOString(),
  }
}

export const useProfileStore = create(
  persist(
    (set) => ({
      profiles: {},

      // Onboarding and later profile edits both recompute BMI/targets from scratch — there's no
      // meaningful difference between "first save" and "an edit" other than onboardingCompleted.
      completeOnboarding: (userId, input) => {
        set((state) => ({
          profiles: { ...state.profiles, [userId]: buildProfile(input, state.profiles[userId]) },
        }))
      },

      updateProfile: (userId, partialInput) => {
        set((state) => {
          const existing = state.profiles[userId]
          const merged = { ...existing, ...partialInput }
          return { profiles: { ...state.profiles, [userId]: buildProfile(merged, existing) } }
        })
      },
    }),
    { name: 'nutri-tracker:profile' },
  ),
)

export function useProfile(userId) {
  return useProfileStore((state) => (userId ? state.profiles[userId] : undefined))
}

export function useIsOnboardingComplete(userId) {
  return useProfileStore((state) => Boolean(userId && state.profiles[userId]?.onboardingCompleted))
}
