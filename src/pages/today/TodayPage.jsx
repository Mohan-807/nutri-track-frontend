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
import { useDayEntries, useDayTotals, useNutritionLogStore } from '../../stores/nutritionLogStore'
import { todayKey, formatDisplayDate } from '../../utils/dateUtils'

export function TodayPage() {
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const removeEntry = useNutritionLogStore((state) => state.removeEntry)

  const dateKey = todayKey()
  const entries = useDayEntries(userId, dateKey)
  const totals = useDayTotals(userId, dateKey)

  return (
    <>
      <TopBar
        title="Today"
        trailingAction={<span className="text-sm text-slate-400 dark:text-slate-500">{formatDisplayDate(dateKey)}</span>}
      />
      <PageContainer className="lg:max-w-3xl">
        <DayOverview totals={totals} targets={profile?.targets} />

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
                <FoodListItem key={entry.id} entry={entry} onDelete={(entryId) => removeEntry(userId, dateKey, entryId)} />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </>
  )
}
