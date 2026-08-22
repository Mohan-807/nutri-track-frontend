import { useEffect, useState } from 'react'
import { Utensils } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { DayOverview } from '../../components/nutrients/DayOverview'
import { FoodListItem } from '../../components/today/FoodListItem'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { useProfile } from '../../stores/profileStore'
import { useDayEntries, useDayStatus, useDayTotals, useNutritionLogStore } from '../../stores/nutritionLogStore'
import { todayKey, formatDisplayDate } from '../../utils/dateUtils'

export function TodayPage() {
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const fetchDay = useNutritionLogStore((state) => state.fetchDay)
  const removeEntry = useNutritionLogStore((state) => state.removeEntry)

  const dateKey = todayKey()
  const status = useDayStatus(userId, dateKey)
  const entries = useDayEntries(userId, dateKey)
  const totals = useDayTotals(userId, dateKey)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (userId && status === 'idle') fetchDay(userId, dateKey)
  }, [userId, dateKey, status, fetchDay])

  async function handleDelete(entryId) {
    setDeleteError('')
    try {
      await removeEntry(userId, dateKey, entryId)
    } catch (error) {
      setDeleteError(error.message)
    }
  }

  return (
    <>
      <TopBar
        title="Today"
        trailingAction={<span className="text-sm text-slate-400 dark:text-slate-500">{formatDisplayDate(dateKey)}</span>}
      />
      <PageContainer className="lg:max-w-3xl">
        {status === 'error' ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Couldn't load today's log.</p>
            <Button variant="secondary" onClick={() => fetchDay(userId, dateKey)}>
              Try again
            </Button>
          </div>
        ) : status === 'loaded' ? (
          <>
            <DayOverview totals={totals} targets={profile?.targets} />

            {deleteError && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-center text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {deleteError}
              </p>
            )}

            <div className="mt-6">
              <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-50">Today's Log</h2>
              {entries.length === 0 ? (
                <EmptyState
                  icon={Utensils}
                  title="No food logged yet"
                  description="Add your first meal to start tracking today's nutrients."
                  action={<Button onClick={() => navigate('/app/add-food')}>Add Food</Button>}
                />
              ) : (
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <FoodListItem key={entry.id} entry={entry} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center py-10">
            <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-accent-600 dark:border-slate-700 dark:border-t-accent-400" />
          </div>
        )}
      </PageContainer>
    </>
  )
}
