import { Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'

// Reused by Today's and History's logged-food list.
export function FoodListItem({ entry, onDelete }) {
  return (
    <Card padding="sm" className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{entry.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {entry.quantity !== 1 ? `${entry.quantity}× ` : ''}
          {entry.servingLabel} · {entry.nutrients.calories} kcal
        </p>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </Card>
  )
}
