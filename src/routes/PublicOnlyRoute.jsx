import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useIsOnboardingComplete } from '../stores/profileStore'

// Keeps an already-logged-in user off /login and /signup.
export function PublicOnlyRoute() {
  const currentUserId = useAuthStore((state) => state.currentUserId)
  const onboardingComplete = useIsOnboardingComplete(currentUserId)

  if (currentUserId) {
    return <Navigate to={onboardingComplete ? '/app/today' : '/onboarding'} replace />
  }

  return <Outlet />
}
