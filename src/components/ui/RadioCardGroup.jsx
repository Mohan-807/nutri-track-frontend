import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'

const COLUMN_CLASSES = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

// Reused by onboarding (gender/activity/goal) and Profile editing — `options[].icon`, when
// given, is an already-resolved lucide component (see utils/iconMap.js for string -> component).
export function RadioCardGroup({ options, value, onChange, columns = 1 }) {
  return (
    <div className={cn('grid gap-3', COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[1])} role="radiogroup">
      {options.map((option) => {
        const isSelected = option.value === value
        const Icon = option.icon

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
              isSelected
                ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500 dark:border-accent-400 dark:bg-accent-500/10 dark:ring-accent-400'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600',
            )}
          >
            {isSelected && (
              <span className="absolute top-3 right-3 flex size-4 items-center justify-center rounded-full bg-accent-600 text-white dark:bg-accent-400 dark:text-slate-950">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            )}
            {Icon && (
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                  isSelected
                    ? 'bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-md shadow-accent-500/30 dark:from-accent-400 dark:to-accent-600'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                )}
              >
                <Icon className="size-5" />
              </span>
            )}
            <span className="flex-1">
              <span className="block text-sm font-medium text-slate-900 dark:text-slate-50">{option.label}</span>
              {option.description && (
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{option.description}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
