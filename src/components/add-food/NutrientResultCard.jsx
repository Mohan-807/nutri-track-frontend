import { Flame } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { MacroRow } from '../nutrients/MacroRow'
import { QuantityStepper } from './QuantityStepper'
import { scaleNutrients } from '../../utils/nutrientMath'
import { NUTRIENT_META } from '../../constants/nutrientKeys'
import { useCountUp } from '../../utils/useCountUp'

const SECONDARY_NUTRIENT_KEYS = ['proteinG', 'carbsG', 'fatG', 'fiberG', 'sugarG', 'sodiumMg']

// Bars here show this food's contribution against the *daily* target (e.g. "22g protein, 44% of
// today's goal"), not a per-food target — same MacroRow component as Today/History, different context.
export function NutrientResultCard({ food, quantity, onQuantityChange, targets, onAdd, adding }) {
  const scaled = scaleNutrients(food.nutrients, quantity)
  const animatedCalories = useCountUp(scaled.calories, { duration: 0.5 })

  return (
    <Card className="relative space-y-5 overflow-hidden border-accent-100 bg-linear-to-br from-white via-accent-50/40 to-white dark:border-accent-500/15 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 size-40 rounded-full bg-linear-to-br from-accent-300 to-accent-500 opacity-20 blur-3xl dark:opacity-10"
      />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{food.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{food.servingLabel}</p>
        </div>
        <QuantityStepper value={quantity} onChange={onQuantityChange} />
      </div>

      <div className="relative text-center">
        <p className="text-gradient-accent text-4xl font-bold tabular-nums tracking-tight">{animatedCalories}</p>
        <p className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Flame className="size-3.5" />
          calories
        </p>
      </div>

      {targets && (
        <div className="relative space-y-3">
          {SECONDARY_NUTRIENT_KEYS.map((key) => (
            <MacroRow key={key} nutrientKey={key} current={scaled[key]} target={targets[NUTRIENT_META[key].targetKey]} size="sm" />
          ))}
        </div>
      )}

      <Button fullWidth size="lg" onClick={onAdd} loading={adding} className="relative">
        Add to Today's Log
      </Button>
    </Card>
  )
}
