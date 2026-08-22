// Used for onboarding/profile UI; the BMR formula's sex-specific constant lives server-side now
// (backend/app/services/nutrient_calc.py).
export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]
