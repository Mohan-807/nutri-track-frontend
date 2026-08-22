// Shared name/alias matching + ranking, used by both the mocked foodLookupService (async,
// capped, simulates a network search) and the Add Food table's live filtering (sync, uncapped —
// it's just narrowing down data you already have client-side, no need to fake latency for that).
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
