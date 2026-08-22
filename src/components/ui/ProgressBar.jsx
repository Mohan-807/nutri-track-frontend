import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'

const HEIGHT_CLASSES = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5' }

// `direction` controls how "over target" reads: 'target' (calories/macros) is neutral either
// way, 'min' (fiber — a floor) never warns, 'max' (sugar/sodium — a ceiling) turns the fill rose
// once the value exceeds the target, regardless of `colorClassName`.
export function ProgressBar({
  value,
  max,
  size = 'md',
  direction = 'target',
  colorClassName = 'bg-accent-600 dark:bg-accent-400',
  trackClassName = 'bg-slate-100 dark:bg-slate-800',
  label,
  showValue = false,
  unit = '',
  className,
}) {
  const shouldReduceMotion = useReducedMotion()
  const ratio = max > 0 ? value / max : 0
  const clampedRatio = Math.min(Math.max(ratio, 0), 1)
  const isOverMax = direction === 'max' && ratio > 1
  const barColor = isOverMax ? 'bg-rose-500 dark:bg-rose-400' : colorClassName

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>}
          {showValue && (
            <span className="tabular-nums text-slate-500 dark:text-slate-400">
              {value}
              {unit} / {max}
              {unit}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full', HEIGHT_CLASSES[size], trackClassName)}>
        <motion.div
          className={cn('h-full rounded-full', barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${clampedRatio * 100}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
