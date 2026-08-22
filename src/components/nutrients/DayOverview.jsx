import { motion } from 'framer-motion'
import { Flame, Sparkles } from 'lucide-react'
import { MACRO_KEYS, MICRO_KEYS, NUTRIENT_META } from '../../constants/nutrientKeys'
import { ProgressRing } from '../ui/ProgressRing'
import { Card } from '../ui/Card'
import { MacroRow } from './MacroRow'
import { useCountUp } from '../../utils/useCountUp'
import { getGreeting } from '../../utils/dateUtils'

function AnimatedRow({ index, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// The calories-ring + macro/micro breakdown shared by Today and History — only the totals/
// targets passed in differ between "today" and "a picked past date".
export function DayOverview({ totals, targets }) {
  const animatedCalories = useCountUp(totals?.calories ?? 0)

  if (!targets) return null

  const remaining = targets.calories - totals.calories
  const remainingLabel = remaining > 0 ? `${remaining} kcal left` : 'Goal reached'

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-accent-100 bg-linear-to-br from-white via-accent-50/50 to-white dark:border-accent-500/15 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 size-48 rounded-full bg-linear-to-br from-accent-300 to-accent-500 opacity-20 blur-3xl dark:opacity-10"
        />

        <div className="relative mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {getGreeting()}
            </p>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Calories today</h2>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-linear-to-r from-accent-500 to-accent-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-accent-500/30 dark:from-accent-400 dark:to-accent-500">
            <Flame className="size-3.5" />
            {remainingLabel}
          </span>
        </div>

        <div className="relative flex flex-col items-center gap-6 md:flex-row md:justify-center">
          <ProgressRing
            value={totals.calories}
            max={targets.calories}
            size="lg"
            glow
            centerLabel={
              <div className="text-center">
                <p className="text-gradient-accent text-3xl font-bold tabular-nums tracking-tight md:text-4xl">
                  {animatedCalories}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">of {targets.calories} kcal</p>
              </div>
            }
          />
          <div className="w-full max-w-xs space-y-3 md:w-64">
            {MACRO_KEYS.map((key, index) => (
              <AnimatedRow key={key} index={index}>
                <MacroRow nutrientKey={key} current={totals[key]} target={targets[NUTRIENT_META[key].targetKey]} />
              </AnimatedRow>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          <Sparkles className="size-3.5" />
          Micronutrients
        </p>
        <div className="space-y-3">
          {MICRO_KEYS.map((key, index) => (
            <AnimatedRow key={key} index={index}>
              <MacroRow
                nutrientKey={key}
                current={totals[key]}
                target={targets[NUTRIENT_META[key].targetKey]}
                size="sm"
              />
            </AnimatedRow>
          ))}
        </div>
      </Card>
    </div>
  )
}
