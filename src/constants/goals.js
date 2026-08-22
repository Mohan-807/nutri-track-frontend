// Goal drives both the calorie target adjustment and the macro split.
export const GOALS = [
  {
    value: 'lose',
    label: 'Lose weight',
    shortLabel: 'Lean',
    description: 'Get lean with a steady calorie deficit',
    icon: 'TrendingDown',
    calorieAdjustment: -500,
    proteinPerKg: 2.0,
    fatPct: 0.25,
  },
  {
    value: 'maintain',
    label: 'Maintain weight',
    shortLabel: 'Maintain',
    description: 'Stay at your current weight',
    icon: 'Equal',
    calorieAdjustment: 0,
    proteinPerKg: 1.6,
    fatPct: 0.3,
  },
  {
    value: 'gain',
    label: 'Gain muscle',
    shortLabel: 'Bulk',
    description: 'Build muscle with a calorie surplus',
    icon: 'TrendingUp',
    calorieAdjustment: 300,
    proteinPerKg: 1.8,
    fatPct: 0.25,
  },
]

export function getGoal(value) {
  return GOALS.find((goal) => goal.value === value) ?? GOALS[1]
}
