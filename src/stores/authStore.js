import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authService from '../services/authService'
import { setAuthToken } from '../services/apiClient'

// Session state for the real backend now — currentUserId/currentUserEmail/accessToken mirror
// what /auth/login and /auth/signup return (backend/app/routers/auth.py). The actual accounts
// table lives in Postgres, owned entirely by the backend.
export const useAuthStore = create(
  persist(
    (set) => ({
      currentUserId: null,
      currentUserEmail: null,
      accessToken: null,
      status: 'idle',
      error: null,

      signup: async ({ email, password }) => {
        set({ status: 'loading', error: null })
        const result = await authService.signup({ email, password })
        if (result.success) {
          setAuthToken(result.token)
          set({
            currentUserId: result.user.id,
            currentUserEmail: result.user.email,
            accessToken: result.token,
            status: 'idle',
            error: null,
          })
        } else {
          set({ status: 'error', error: result.error })
        }
        return result
      },

      login: async ({ email, password }) => {
        set({ status: 'loading', error: null })
        const result = await authService.login({ email, password })
        if (result.success) {
          setAuthToken(result.token)
          set({
            currentUserId: result.user.id,
            currentUserEmail: result.user.email,
            accessToken: result.token,
            status: 'idle',
            error: null,
          })
        } else {
          set({ status: 'error', error: result.error })
        }
        return result
      },

      logout: async () => {
        await authService.logout()
        setAuthToken(null)
        set({ currentUserId: null, currentUserEmail: null, accessToken: null, status: 'idle', error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'nutri-tracker:auth',
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        currentUserEmail: state.currentUserEmail,
        accessToken: state.accessToken,
      }),
    },
  ),
)

// apiClient keeps the token in a plain in-memory variable, not localStorage — so once zustand's
// persist middleware finishes rehydrating a previously saved session, push that restored token
// into apiClient once. Same hasHydrated()/onFinishHydration() pattern HydrationGate already uses
// for this store, just consumed here instead of in a component.
function syncApiToken(state) {
  setAuthToken(state.accessToken ?? null)
}

useAuthStore.persist.onFinishHydration(syncApiToken)
if (useAuthStore.persist.hasHydrated()) {
  syncApiToken(useAuthStore.getState())
}
