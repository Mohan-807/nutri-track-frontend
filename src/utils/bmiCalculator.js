export function calculateBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return 0
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBmiCategory(bmi) {
  if (!bmi || bmi <= 0) return 'unknown'
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obese'
}

export const BMI_CATEGORY_META = {
  underweight: { label: 'Underweight', color: 'blue' },
  normal: { label: 'Normal', color: 'accent' },
  overweight: { label: 'Overweight', color: 'amber' },
  obese: { label: 'Obese', color: 'rose' },
  unknown: { label: '—', color: 'slate' },
}

// Fixed BMI band boundaries used by the BMICard's 4-zone gauge (underweight | normal | overweight | obese).
export const BMI_GAUGE_BANDS = [
  { category: 'underweight', min: 0, max: 18.5 },
  { category: 'normal', min: 18.5, max: 25 },
  { category: 'overweight', min: 25, max: 30 },
  { category: 'obese', min: 30, max: 40 },
]
