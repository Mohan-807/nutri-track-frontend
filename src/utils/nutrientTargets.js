import { getActivityLevel } from '../constants/activityLevels'
import { getGoal } from '../constants/goals'
import { calculateBmi } from './bmiCalculator'

// Mifflin-St Jeor BMR. `gender: 'other'` uses the documented midpoint of the male/female constants.
export function calculateBmr({ weightKg, heightCm, age, gender }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  if (gender === 'male') return Math.round(base + 5)
  if (gender === 'female') return Math.round(base - 161)
  return Math.round(base - 78)
}

export function calculateTdee(bmr, activityLevel) {
  const multiplier = getActivityLevel(activityLevel)?.multiplier ?? 1.2
  return Math.round(bmr * multiplier)
}

const MIN_CALORIES = 1200 // floor so an aggressive deficit + low bodyweight never targets something unsafe

// BMR -> TDEE -> goal-adjusted calorie target -> macro split (protein by g/kg, fat by % of
// calories, carbs as the remainder). Fiber is a floor ("reach at least"); sugar/sodium are
// ceilings ("stay under") — see NUTRIENT_META's `direction` field for how these render.
export function calculateDailyTargets({ weightKg, heightCm, age, gender, activityLevel, goal }) {
  const bmr = calculateBmr({ weightKg, heightCm, age, gender })
  const tdee = calculateTdee(bmr, activityLevel)
  const bmi = calculateBmi(weightKg, heightCm)
  const goalConfig = getGoal(goal)

  const calories = Math.max(Math.round(tdee + goalConfig.calorieAdjustment), MIN_CALORIES)
  const proteinG = Math.round(goalConfig.proteinPerKg * weightKg)
  const fatG = Math.round((calories * goalConfig.fatPct) / 9)
  const carbsG = Math.max(Math.round((calories - proteinG * 4 - fatG * 9) / 4), 0)

  const fiberG = Math.round((calories / 1000) * 14) // IOM guideline: ~14g fiber per 1000 kcal
  const sugarMaxG = Math.round((calories * 0.1) / 4) // WHO guideline: <=10% of calories from free sugar
  const sodiumMaxMg = 2300 // standard daily ceiling

  return { bmr, tdee, bmi, calories, proteinG, carbsG, fatG, fiberG, sugarMaxG, sodiumMaxMg }
}
