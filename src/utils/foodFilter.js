// Name/alias matching + ranking for the Add Food table's live, client-side filtering over the
// already-fetched catalog (foodCatalogStore). Ported 1:1 to the backend as rank_foods() in
// app/services/food_service.py, which the /foods endpoint uses for the same ranking server-side.
function normalize(value) {
  return value.trim().toLowerCase()
}

// Prefix matches rank above substring matches; an empty query returns every food, unranked.
export function filterFoods(foods, query) {
  const normalizedQuery = normalize(query ?? '')
  if (!normalizedQuery) return foods

  const scored = []
  for (const food of foods) {
    const names = [food.name, ...(food.aliases ?? [])].map(normalize)
    const isPrefixMatch = names.some((name) => name.startsWith(normalizedQuery))
    const isSubstringMatch = names.some((name) => name.includes(normalizedQuery))
    if (isPrefixMatch) scored.push({ food, rank: 0 })
    else if (isSubstringMatch) scored.push({ food, rank: 1 })
  }

  scored.sort((a, b) => a.rank - b.rank)
  return scored.map((entry) => entry.food)
}
