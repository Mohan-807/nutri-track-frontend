import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { getMonthGrid, parseDateKey, todayKey } from '../../utils/dateUtils'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function Calendar({ selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(() => parseDateKey(selectedDate ?? todayKey()))
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const weeks = getMonthGrid(year, month)
  const today = todayKey()

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </p>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 dark:text-slate-500">
        {WEEKDAY_LABELS.map((label, index) => (
          <div key={index} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((dateKey, index) => {
          if (!dateKey) return <div key={index} />

          const isSelected = dateKey === selectedDate
          const isTodayCell = dateKey === today
          const isFuture = dateKey > today

          return (
            <button
              key={dateKey}
              type="button"
              disabled={isFuture}
              onClick={() => onSelectDate(dateKey)}
              className={cn(
                'aspect-square rounded-lg text-sm font-medium transition-colors',
                isSelected && 'bg-accent-600 text-white dark:bg-accent-500',
                !isSelected && isTodayCell && 'border border-accent-300 text-accent-700 dark:border-accent-500/50 dark:text-accent-400',
                !isSelected && !isTodayCell && isFuture && 'text-slate-300 dark:text-slate-600',
                !isSelected &&
                  !isTodayCell &&
                  !isFuture &&
                  'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
              )}
            >
              {Number(dateKey.split('-')[2])}
            </button>
          )
        })}
      </div>
    </div>
  )
}
