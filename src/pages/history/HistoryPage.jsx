import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, Utensils } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { DayOverview } from '../../components/nutrients/DayOverview'
import { FoodListItem } from '../../components/today/FoodListItem'
import { DateStrip } from '../../components/history/DateStrip'
import { Calendar } from '../../components/history/Calendar'
import { Sheet } from '../../components/ui/Sheet'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { useProfile } from '../../stores/profileStore'
import { useDayEntries, useDayStatus, useDayTotals, useNutritionLogStore } from '../../stores/nutritionLogStore'
import { formatDayLabel, formatDisplayDate, todayKey } from '../../utils/dateUtils'

export function HistoryPage() {
  const { dateKey } = useParams()
  const navigate = useNavigate()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const fetchDay = useNutritionLogStore((state) => state.fetchDay)
  const removeEntry = useNutritionLogStore((state) => state.removeEntry)

  const isFutureDate = dateKey > todayKey()
  const status = useDayStatus(userId, dateKey)
  const entries = useDayEntries(userId, dateKey)
  const totals = useDayTotals(userId, dateKey)

  useEffect(() => {
    if (userId && !isFutureDate && status === 'idle') fetchDay(userId, dateKey)
  }, [userId, dateKey, isFutureDate, status, fetchDay])

  async function handleDelete(entryId) {
    setDeleteError('')
    try {
      await removeEntry(userId, dateKey, entryId)
    } catch (error) {
      setDeleteError(error.message)
    }
  }

  function handleSelectDate(nextDateKey) {
    setCalendarOpen(false)
    navigate(`/app/history/${nextDateKey}`)
  }

  return (
    <>
      <TopBar
        title="History"
        trailingAction={
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <CalendarDays className="size-5" />
          </button>
        }
      />
      <PageContainer className="lg:max-w-3xl">
        <DateStrip selectedDate={dateKey} onSelectDate={handleSelectDate} />

        <p className="mt-4 mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          {formatDayLabel(dateKey)} <span className="text-slate-400 dark:text-slate-500">· {formatDisplayDate(dateKey)}</span>
        </p>

        {isFutureDate ? (
          <EmptyState icon={Utensils} title="Nothing to show yet" description="You can't log nutrition for a future date." />
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Couldn't load this day's log.</p>
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
              <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-50">Logged foods</h2>
              {entries.length === 0 ? (
                <EmptyState icon={Utensils} title="No entries for this day" description="Nothing was logged on this date." />
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

      <Sheet isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} title="Jump to date">
        <Calendar selectedDate={dateKey} onSelectDate={handleSelectDate} />
      </Sheet>
    </>
  )
}
