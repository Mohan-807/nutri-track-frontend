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

export function emptyTotals() {
  return { ...EMPTY_TOTALS }
}
