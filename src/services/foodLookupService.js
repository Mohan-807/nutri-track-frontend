import mockFoods from '../data/mockFoods.json'
import { filterFoods } from '../utils/foodFilter'
import { wait } from './wait'

const MAX_RESULTS = 5

// Stands in for a real "fetch nutrition data from the web" call — same async envelope shape,
// so swapping this internal implementation for a real fetch() later won't touch AddFoodPage.
// (The Add Food page's live table filters mockFoods directly via filterFoods — this async,
// capped version is the seam for whenever a real backend search endpoint replaces it.)
export async function lookupFood(query) {
  await wait(500)

  if (!query?.trim()) {
    return { success: false, results: [], error: 'Type a food name to search.' }
  }

  const results = filterFoods(mockFoods, query).slice(0, MAX_RESULTS)

  if (results.length === 0) {
    return { success: false, results: [], error: `No results found for "${query}".` }
  }

  return { success: true, results }
}
