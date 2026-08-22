import { GOALS } from '../../constants/goals'
import { resolveIcon } from '../../utils/iconMap'
import { Card } from '../ui/Card'

// Icons are pre-resolved at module scope (not inside the component body) so the referenced
// component is a stable identity across renders, not "created during render".
const GOAL_OPTIONS = GOALS.map((goal) => ({ ...goal, icon: resolveIcon(goal.icon) }))

export function GoalCard({ goal }) {
  const goalConfig = GOAL_OPTIONS.find((entry) => entry.value === goal)
  if (!goalConfig) return null
  const Icon = goalConfig.icon

  return (
    <Card className="flex items-center gap-3">
      {Icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-md shadow-accent-500/30 dark:from-accent-400 dark:to-accent-600">
          <Icon className="size-5" />
        </span>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Current goal</p>
        <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{goalConfig.label}</p>
      </div>
    </Card>
  )
}
