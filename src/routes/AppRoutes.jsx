import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppLayout } from '../layouts/AppLayout'
import { SignupPage } from '../pages/auth/SignupPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { OnboardingPage } from '../pages/onboarding/OnboardingPage'
import { ChatPage } from '../pages/chat/ChatPage'
import { TodayPage } from '../pages/today/TodayPage'
import { HistoryPage } from '../pages/history/HistoryPage'
import { AddFoodPage } from '../pages/add-food/AddFoodPage'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { todayKey } from '../utils/dateUtils'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute requireOnboarding={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="today" replace />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="history" element={<Navigate to={`/app/history/${todayKey()}`} replace />} />
            <Route path="history/:dateKey" element={<HistoryPage />} />
            <Route path="add-food" element={<AddFoodPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/app/today" replace />} />
        <Route path="*" element={<Navigate to="/app/today" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
