import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'
import { getLastNDays, isToday, parseDateKey } from '../../utils/dateUtils'

// Horizontal-scroll day chips; the Calendar sheet (opened from HistoryPage's TopBar) covers
// jumping further back than this range.
export function DateStrip({ selectedDate, onSelectDate, rangeDays = 14 }) {
  const days = getLastNDays(rangeDays)
  const selectedRef = useRef(null)

  // The selected chip (usually "today", the rightmost one) should already be in view on
  // mount/selection change — a horizontal scroller that opens scrolled to its start would hide it.
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest', inline: 'end' })
  }, [selectedDate])

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      {days.map((dateKey) => {
        const date = parseDateKey(dateKey)
        const isSelected = dateKey === selectedDate

        return (
          <button
            key={dateKey}
            ref={isSelected ? selectedRef : null}
            type="button"
            onClick={() => onSelectDate(dateKey)}
            className={cn(
              'flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-center transition-colors',
              isSelected
                ? 'bg-accent-600 text-white dark:bg-accent-500'
                : isToday(dateKey)
                  ? 'border border-accent-300 text-accent-700 dark:border-accent-500/50 dark:text-accent-400'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
              {date.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            <span className="text-sm font-semibold tabular-nums">{date.getDate()}</span>
          </button>
        )
      })}
    </div>
  )
}
