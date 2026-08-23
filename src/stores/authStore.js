import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authService from '../services/authService'
import { setAuthToken, setUnauthorizedHandler } from '../services/apiClient'
import { useProfileStore } from './profileStore'

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
          // Resolve profile status (a brand-new signup will 404 → 'not_found') before this
          // action resolves, so anything reading useIsOnboardingComplete right after — the
          // route guards, LoginPage's own post-login navigate — sees a settled answer instead
          // of a momentary "unknown" that would otherwise race the navigation.
          await useProfileStore.getState().fetchProfile(result.user.id)
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
          await useProfileStore.getState().fetchProfile(result.user.id)
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
      // Bumped when this store started persisting a real backend JWT. Version 0 is the older
      // localStorage-only session shape, which held a currentUserId but no accessToken at all —
      // rehydrating one of those produces a "logged in" user whose every request 401s. Anything
      // without a token is discarded here so the app treats it as simply logged out.
      version: 1,
      migrate: (persisted, version) => {
        if (version < 1 || !persisted?.accessToken) {
          return { currentUserId: null, currentUserEmail: null, accessToken: null }
        }
        return persisted
      },
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        currentUserEmail: state.currentUserEmail,
        accessToken: state.accessToken,
      }),
    },
  ),
)

// A request that carried a token still came back 401 → the session is dead (expired JWT, or a
// user row that no longer exists). Clear it so the route guards fall through to /login instead of
// leaving the user inside /app where every request fails. Deliberately not authStore's async
// logout(): this runs mid-request and only needs to drop local session state.
setUnauthorizedHandler(() => {
  setAuthToken(null)
  useAuthStore.setState({ currentUserId: null, currentUserEmail: null, accessToken: null, status: 'idle', error: null })
})

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
