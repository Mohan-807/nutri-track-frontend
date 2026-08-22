import { Plus, SearchX } from 'lucide-react'
import { NUTRIENT_META, NUTRIENT_COLOR_CLASSES } from '../../constants/nutrientKeys'
import { EmptyState } from '../ui/EmptyState'
import { cn } from '../../utils/cn'

function ColumnDot({ nutrientKey }) {
  const colors = NUTRIENT_COLOR_CLASSES[NUTRIENT_META[nutrientKey].color]
  return <span className={cn('inline-block size-2 rounded-full bg-linear-to-br', colors.gradient)} />
}

const HEADER_CELL = 'px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

// Condensed columns (fiber/sugar/sodium are one tap away in NutrientResultCard, not hidden data).
// The wrapper scrolls both ways so the header can stay sticky-top and the food name sticky-left
// without fighting the page's own scroll/TopBar.
export function FoodTable({ foods, onSelect }) {
  if (foods.length === 0) {
    return <EmptyState icon={SearchX} title="No matches" description="Try a different food name." className="mt-6" />
  }

  return (
    <div className="mt-4 max-h-[65vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/80">
            <th className={cn(HEADER_CELL, 'sticky top-0 left-0 z-20 bg-slate-50 text-left dark:bg-slate-800/80')}>Food</th>
            <th className={cn(HEADER_CELL, 'sticky top-0 z-10 bg-slate-50 text-left whitespace-nowrap dark:bg-slate-800/80')}>
              Serving
            </th>
            <th className={cn(HEADER_CELL, 'sticky top-0 z-10 bg-slate-50 text-right dark:bg-slate-800/80')}>Calories</th>
            <th className={cn(HEADER_CELL, 'sticky top-0 z-10 bg-slate-50 text-right dark:bg-slate-800/80')}>
              <span className="inline-flex items-center gap-1.5">
                <ColumnDot nutrientKey="proteinG" />
                Protein
              </span>
            </th>
            <th className={cn(HEADER_CELL, 'sticky top-0 z-10 bg-slate-50 text-right dark:bg-slate-800/80')}>
              <span className="inline-flex items-center gap-1.5">
                <ColumnDot nutrientKey="carbsG" />
                Carbs
              </span>
            </th>
            <th className={cn(HEADER_CELL, 'sticky top-0 z-10 bg-slate-50 text-right dark:bg-slate-800/80')}>
              <span className="inline-flex items-center gap-1.5">
                <ColumnDot nutrientKey="fatG" />
                Fat
              </span>
            </th>
            <th className="sticky top-0 z-10 w-10 bg-slate-50 px-2 py-2.5 dark:bg-slate-800/80" />
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr
              key={food.id}
              onClick={() => onSelect(food)}
              className="cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-accent-50/60 dark:border-slate-800 dark:hover:bg-accent-500/5"
            >
              <td className="sticky left-0 z-10 bg-white px-3 py-2.5 font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                {food.name}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-slate-500 dark:text-slate-400">{food.servingLabel}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                {food.nutrients.calories}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-slate-500 dark:text-slate-400">
                {food.nutrients.proteinG}g
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-slate-500 dark:text-slate-400">
                {food.nutrients.carbsG}g
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-slate-500 dark:text-slate-400">
                {food.nutrients.fatG}g
              </td>
              <td className="px-2 py-2.5 text-center">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-linear-to-br from-accent-500 to-accent-700 text-white dark:from-accent-400 dark:to-accent-600">
                  <Plus className="size-4" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
