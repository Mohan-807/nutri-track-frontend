// Standard TDEE activity multipliers (Mifflin-St Jeor convention).
export const ACTIVITY_LEVELS = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise, desk job',
    multiplier: 1.2,
  },
  {
    value: 'light',
    label: 'Lightly active',
    description: 'Light exercise 1-3 days/week',
    multiplier: 1.375,
  },
  {
    value: 'moderate',
    label: 'Moderately active',
    description: 'Moderate exercise 3-5 days/week',
    multiplier: 1.55,
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Hard exercise 6-7 days/week',
    multiplier: 1.725,
  },
  {
    value: 'very_active',
    label: 'Very active',
    description: 'Very hard exercise, physical job',
    multiplier: 1.9,
  },
]

export function getActivityLevel(value) {
  return ACTIVITY_LEVELS.find((level) => level.value === value)
}
