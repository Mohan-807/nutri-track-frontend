import { create } from 'zustand'
import { apiClient, ApiError } from '../services/apiClient'

// Server-owned now — no `persist` middleware. The backend (GET/PUT /profile/me,
// POST /profile/onboarding — backend/app/routers/profile.py) is the source of truth, including
// BMI/BMR/TDEE/target calculation (app/services/nutrient_calc.py); this store is just a
// per-user cache of whatever it last returned, plus a status so callers can tell "haven't
// asked yet" apart from "asked and there's no profile" apart from "asked and it failed".
export const useProfileStore = create((set, get) => ({
  profilesByUser: {},
  statusByUser: {}, // 'idle' | 'loading' | 'loaded' | 'not_found' | 'error'
  errorByUser: {},

  fetchProfile: async (userId) => {
    if (!userId) return null
    set((state) => ({ statusByUser: { ...state.statusByUser, [userId]: 'loading' } }))
    try {
      const profile = await apiClient.get('/profile/me')
      set((state) => ({
        profilesByUser: { ...state.profilesByUser, [userId]: profile },
        statusByUser: { ...state.statusByUser, [userId]: 'loaded' },
      }))
      return profile
    } catch (error) {
      // 404 means "no profile yet" (new signup, onboarding not done) — a normal state, not a
      // failure, so it's tracked separately from a real fetch error (network/server down).
      if (error instanceof ApiError && error.status === 404) {
        set((state) => ({
          profilesByUser: { ...state.profilesByUser, [userId]: undefined },
          statusByUser: { ...state.statusByUser, [userId]: 'not_found' },
        }))
        return null
      }
      set((state) => ({
        statusByUser: { ...state.statusByUser, [userId]: 'error' },
        errorByUser: { ...state.errorByUser, [userId]: error.message },
      }))
      return null
    }
  },

  completeOnboarding: async (userId, input) => {
    const profile = await apiClient.post('/profile/onboarding', input)
    set((state) => ({
      profilesByUser: { ...state.profilesByUser, [userId]: profile },
      statusByUser: { ...state.statusByUser, [userId]: 'loaded' },
    }))
    return profile
  },

  updateProfile: async (userId, partialInput) => {
    // PUT /profile/me expects the full ProfileIn shape, not a partial — merge over the cached
    // profile first (ProfileForm already submits all fields today, but this keeps the action
    // correct even if a future caller sends a true partial).
    const merged = { ...get().profilesByUser[userId], ...partialInput }
    const profile = await apiClient.put('/profile/me', {
      heightCm: merged.heightCm,
      weightKg: merged.weightKg,
      age: merged.age,
      gender: merged.gender,
      activityLevel: merged.activityLevel,
      goal: merged.goal,
    })
    set((state) => ({ profilesByUser: { ...state.profilesByUser, [userId]: profile } }))
    return profile
  },
}))

export function useProfile(userId) {
  return useProfileStore((state) => (userId ? state.profilesByUser[userId] : undefined))
}

export function useProfileStatus(userId) {
  return useProfileStore((state) => (userId ? (state.statusByUser[userId] ?? 'idle') : 'idle'))
}

export function useIsOnboardingComplete(userId) {
  return useProfileStore((state) => Boolean(userId && state.profilesByUser[userId]?.onboardingCompleted))
}
