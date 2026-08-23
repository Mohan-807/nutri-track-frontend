// Name/alias matching + ranking for the Add Food table's live, client-side filtering over the
// already-fetched catalog (foodCatalogStore). Ported 1:1 to the backend as rank_foods() in
// app/services/food_service.py, which the /foods endpoint (and the AI chat's search_food tool)
// uses for the same ranking server-side.
function normalize(value) {
  return value.trim().toLowerCase()
}

// Prefix matches rank above substring matches, which rank above token matches; an empty query
// returns every food, unranked. The token tier exists because "contains" alone only matches when
// the *query* is inside the name (e.g. "apple" in "pineapple") — a multi-word query like "cooked
// rice" is never a substring of a shorter alias like "rice", even though every word overlaps. See
// food_service.py's rank_foods for the fuller story (an AI chat search miss that caused a
// near-duplicate food to get created instead of reusing an existing one).
export function filterFoods(foods, query) {
  const normalizedQuery = normalize(query ?? '')
  if (!normalizedQuery) return foods

  const queryTokens = normalizedQuery.split(' ')

  const scored = []
  for (const food of foods) {
    const names = [food.name, ...(food.aliases ?? [])].map(normalize)
    const isPrefixMatch = names.some((name) => name.startsWith(normalizedQuery))
    const isSubstringMatch = names.some((name) => name.includes(normalizedQuery))
    const isTokenMatch = names.some((name) => queryTokens.some((token) => name.includes(token) || token.includes(name)))
    if (isPrefixMatch) scored.push({ food, rank: 0 })
    else if (isSubstringMatch) scored.push({ food, rank: 1 })
    else if (isTokenMatch) scored.push({ food, rank: 2 })
  }

  scored.sort((a, b) => a.rank - b.rank)
  return scored.map((entry) => entry.food)
}
