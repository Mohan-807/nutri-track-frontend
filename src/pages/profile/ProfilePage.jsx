import { useState } from 'react'
import { TopBar } from '../../components/layout/TopBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { BMICard } from '../../components/profile/BMICard'
import { GoalCard } from '../../components/profile/GoalCard'
import { ProfileForm } from '../../components/profile/ProfileForm'
import { Toggle } from '../../components/ui/Toggle'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { useProfile, useProfileStore } from '../../stores/profileStore'
import { useUiStore } from '../../stores/uiStore'

export function ProfilePage() {
  const userId = useAuthStore((state) => state.currentUserId)
  const email = useAuthStore((state) => state.currentUserEmail)
  const logout = useAuthStore((state) => state.logout)
  const profile = useProfile(userId)
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  const [saved, setSaved] = useState(false)

  if (!profile) return null

  function handleSave(partialInput) {
    updateProfile(userId, partialInput)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <TopBar
        title="Profile"
        trailingAction={<Toggle checked={theme === 'dark'} onChange={toggleTheme} className="md:hidden" />}
      />
      <PageContainer className="lg:max-w-3xl">
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{email}</p>

        <div className="grid gap-4 md:grid-cols-[280px_1fr] md:items-start">
          <div className="space-y-4">
            <BMICard bmi={profile.bmi} />
            <GoalCard goal={profile.goal} />
          </div>

          <div className="mt-4 space-y-4 md:mt-0">
            <ProfileForm profile={profile} onSave={handleSave} />
            {saved && <p className="text-center text-sm font-medium text-accent-600 dark:text-accent-400">Saved</p>}
            <Button variant="danger" fullWidth onClick={() => logout()}>
              Log out
            </Button>
          </div>
        </div>
      </PageContainer>
    </>
  )
}
