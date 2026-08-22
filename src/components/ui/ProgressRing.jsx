import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn'

const SIZE_PX = { sm: 80, md: 120, lg: 160, xl: 200 }
const DEFAULT_STROKE = { sm: 6, md: 10, lg: 12, xl: 14 }

// The hero "calories today" visual — see components/nutrients/MacroRow for the linear bars used
// for every other nutrient. Strokes with a gradient (light->dark accent, flips via the
// --ring-from/--ring-to custom properties in index.css) and an optional soft glow behind it.
export function ProgressRing({
  value,
  max,
  size = 'md',
  strokeWidth,
  gradientFrom = 'var(--ring-from)',
  gradientTo = 'var(--ring-to)',
  trackClassName = 'stroke-slate-200 dark:stroke-slate-800',
  glow = false,
  centerLabel,
  className,
}) {
  const shouldReduceMotion = useReducedMotion()
  const gradientId = useId()
  const diameter = SIZE_PX[size]
  const stroke = strokeWidth ?? DEFAULT_STROKE[size]
  const radius = (diameter - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circumference * (1 - ratio)

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: diameter, height: diameter }}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-40 blur-2xl"
          style={{ background: `radial-gradient(circle, ${gradientTo}, transparent 70%)` }}
        />
      )}
      <svg width={diameter} height={diameter} className="relative -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
        <circle cx={diameter / 2} cy={diameter / 2} r={radius} strokeWidth={stroke} fill="none" className={trackClassName} />
        <motion.circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: shouldReduceMotion ? offset : circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{centerLabel}</div>
    </div>
  )
}
