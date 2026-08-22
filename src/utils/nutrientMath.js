const EMPTY_TOTALS = {
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
  sugarG: 0,
  sodiumMg: 0,
}

function round1(n) {
  return Math.round(n * 10) / 10
}

// Scales a mock food's per-serving nutrients by a quantity (servings), rounding each field.
export function scaleNutrients(nutrients, quantity) {
  const scaled = {}
  for (const [key, value] of Object.entries(nutrients)) {
    scaled[key] = round1(value * quantity)
  }
  return scaled
}

// Sums a day's logged entries into one nutrient totals object.
export function sumNutrients(entries) {
  const totals = { ...EMPTY_TOTALS }
  for (const entry of entries) {
    for (const key of Object.keys(totals)) {
      totals[key] += entry.nutrients?.[key] ?? 0
    }
  }
  for (const key of Object.keys(totals)) totals[key] = round1(totals[key])
  return totals
}

export function emptyTotals() {
  return { ...EMPTY_TOTALS }
}
