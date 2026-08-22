import { useEffect, useSyncExternalStore } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { Button } from '../components/ui/Button'

// Blocks rendering the router until authStore rehydrates from localStorage — without this, a
// refresh would briefly see currentUserId=null and flash-redirect to /login before zustand's
// persist middleware finishes reading storage. useSyncExternalStore is the right tool here: it
// subscribes to persist's own hydration-finished event instead of a setState-in-effect.
function useAuthHydrated() {
  return useSyncExternalStore(
    (callback) => useAuthStore.persist.onFinishHydration(callback),
    () => useAuthStore.persist.hasHydrated(),
  )
}

function Spinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-accent-600 dark:border-slate-700 dark:border-t-accent-400" />
    </div>
  )
}

export function HydrationGate({ children }) {
  const authHydrated = useAuthHydrated()
  const currentUserId = useAuthStore((state) => state.currentUserId)
  const profileStatus = useProfileStore((state) => (currentUserId ? (state.statusByUser[currentUserId] ?? 'idle') : 'idle'))
  const fetchProfile = useProfileStore((state) => state.fetchProfile)

  // authStore itself already resolves the profile fetch as part of login()/signup(), so this
  // effect only ever fires on a hard refresh with an existing persisted session — the one case
  // where we have a currentUserId but nothing has asked the backend for their profile yet.
  // Route guards (ProtectedRoute/PublicOnlyRoute) read useIsOnboardingComplete synchronously,
  // so it must be settled before `children` (the router) renders at all.
  useEffect(() => {
    if (authHydrated && currentUserId && profileStatus === 'idle') {
      fetchProfile(currentUserId)
    }
  }, [authHydrated, currentUserId, profileStatus, fetchProfile])

  if (!authHydrated) return <Spinner />
  if (!currentUserId) return children
  if (profileStatus === 'idle' || profileStatus === 'loading') return <Spinner />

  if (profileStatus === 'error') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center dark:bg-slate-950">
        <p className="text-sm text-slate-500 dark:text-slate-400">Couldn't reach the server to load your profile.</p>
        <Button variant="secondary" onClick={() => fetchProfile(currentUserId)}>
          Try again
        </Button>
      </div>
    )
  }

  return children
}
