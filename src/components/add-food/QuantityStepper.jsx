import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({ value, onChange, step = 0.5, min = 0.5, max = 10, unit = 'serving' }) {
  function decrement() {
    onChange(Math.max(min, Math.round((value - step) * 100) / 100))
  }
  function increment() {
    onChange(Math.min(max, Math.round((value + step) * 100) / 100))
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={decrement}
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Minus className="size-4" />
      </button>
      <div className="min-w-16 text-center">
        <p className="text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">{value}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {unit}
          {value !== 1 ? 's' : ''}
        </p>
      </div>
      <button
        type="button"
        onClick={increment}
        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
