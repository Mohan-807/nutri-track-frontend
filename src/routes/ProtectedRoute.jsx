import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useIsOnboardingComplete } from '../stores/profileStore'

export function ProtectedRoute({ requireOnboarding = true }) {
  const currentUserId = useAuthStore((state) => state.currentUserId)
  const onboardingComplete = useIsOnboardingComplete(currentUserId)

  if (!currentUserId) return <Navigate to="/login" replace />
  if (requireOnboarding && !onboardingComplete) return <Navigate to="/onboarding" replace />

  return <Outlet />
}
