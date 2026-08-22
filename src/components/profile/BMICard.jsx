import { motion, useReducedMotion } from 'framer-motion'
import { BMI_CATEGORY_META, BMI_GAUGE_BANDS, getBmiCategory } from '../../utils/bmiCalculator'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

const GAUGE_MAX = 40

const BAND_BAR_CLASSES = {
  underweight: 'bg-linear-to-r from-blue-300 to-blue-500 dark:from-blue-500 dark:to-blue-400',
  normal: 'bg-linear-to-r from-accent-400 to-accent-600 dark:from-accent-500 dark:to-accent-400',
  overweight: 'bg-linear-to-r from-amber-300 to-amber-500 dark:from-amber-500 dark:to-amber-400',
  obese: 'bg-linear-to-r from-rose-300 to-rose-500 dark:from-rose-500 dark:to-rose-400',
}

const BADGE_CLASSES = {
  underweight: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  normal: 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400',
  overweight: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  obese: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  unknown: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

// 4-zone horizontal gauge with a marker at the user's actual BMI.
export function BMICard({ bmi }) {
  const shouldReduceMotion = useReducedMotion()
  const category = getBmiCategory(bmi)
  const meta = BMI_CATEGORY_META[category]
  const markerPercent = Math.min(Math.max((bmi / GAUGE_MAX) * 100, 0), 100)

  return (
    <Card className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Your BMI</p>
          <p className="text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">{bmi || '—'}</p>
        </div>
        <span className={cn('rounded-full px-3 py-1 text-sm font-medium', BADGE_CLASSES[category])}>{meta.label}</span>
      </div>

      <div className="relative pt-2">
        <div className="flex h-2.5 overflow-hidden rounded-full">
          {BMI_GAUGE_BANDS.map((band) => (
            <div
              key={band.category}
              className={cn('h-full', BAND_BAR_CLASSES[band.category])}
              style={{ width: `${((band.max - band.min) / GAUGE_MAX) * 100}%` }}
            />
          ))}
        </div>
        {bmi > 0 && (
          <motion.div
            className="absolute top-0 -translate-x-1/2"
            initial={{ left: shouldReduceMotion ? `${markerPercent}%` : '0%', opacity: 0 }}
            animate={{ left: `${markerPercent}%`, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
          >
            <div className="size-3 rounded-full border-2 border-white bg-slate-900 shadow-md ring-4 ring-slate-900/10 dark:border-slate-800 dark:bg-slate-50 dark:ring-white/10" />
          </motion.div>
        )}
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>Underweight</span>
        <span>Normal</span>
        <span>Overweight</span>
        <span>Obese</span>
      </div>
    </Card>
  )
}
