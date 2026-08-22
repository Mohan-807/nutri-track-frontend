import { useSyncExternalStore } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'

// Blocks rendering the router until persisted stores rehydrate from localStorage — without
// this, a refresh would briefly see currentUserId=null and flash-redirect to /login before
// zustand's persist middleware finishes reading storage. useSyncExternalStore is the right tool
// here: it subscribes to persist's own hydration-finished event instead of a setState-in-effect.
function useStoreHydrated(store) {
  return useSyncExternalStore(
    (callback) => store.persist.onFinishHydration(callback),
    () => store.persist.hasHydrated(),
  )
}

export function HydrationGate({ children }) {
  const authHydrated = useStoreHydrated(useAuthStore)
  const profileHydrated = useStoreHydrated(useProfileStore)

  if (!authHydrated || !profileHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-accent-600 dark:border-slate-700 dark:border-t-accent-400" />
      </div>
    )
  }

  return children
}
