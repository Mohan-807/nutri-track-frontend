import { NUTRIENT_META, NUTRIENT_COLOR_CLASSES } from '../../constants/nutrientKeys'
import { ProgressBar } from '../ui/ProgressBar'
import { resolveIcon } from '../../utils/iconMap'
import { cn } from '../../utils/cn'

const BADGE_SIZE_CLASSES = { sm: 'size-7', md: 'size-9' }
const ICON_SIZE_CLASSES = { sm: 'size-3.5', md: 'size-4' }

// Icons are pre-resolved at module scope (not inside the component body) so each is a stable
// identity across renders, not "created during render".
const RESOLVED_ICONS = Object.fromEntries(
  Object.entries(NUTRIENT_META).map(([key, meta]) => [key, resolveIcon(meta.icon)]),
)

// Gradient icon badge + label + bar + "12g / 80g" — the one row used everywhere a nutrient
// needs to show current-vs-target: Today, History, and Add Food's result card.
export function MacroRow({ nutrientKey, current, target, size = 'md', className }) {
  const meta = NUTRIENT_META[nutrientKey]
  if (!meta) return null

  const colors = NUTRIENT_COLOR_CLASSES[meta.color]
  const Icon = RESOLVED_ICONS[nutrientKey]
  const unitLabel = meta.unit === 'kcal' ? ' kcal' : meta.unit

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {Icon && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-linear-to-br text-white',
            BADGE_SIZE_CLASSES[size],
            colors.gradient,
          )}
        >
          <Icon className={ICON_SIZE_CLASSES[size]} strokeWidth={2.25} />
        </span>
      )}
      <ProgressBar
        className="flex-1"
        value={current}
        max={target}
        direction={meta.direction}
        colorClassName={colors.bar}
        label={meta.label}
        showValue
        unit={unitLabel}
        size={size}
      />
    </div>
  )
}
