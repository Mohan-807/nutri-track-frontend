import { create } from 'zustand'
import mockFoods from '../data/mockFoods.json'
import { generateId } from '../utils/id'

// Deliberately NOT wrapped in zustand's `persist` — there's no backend/database yet, so foods
// added here live only for the current session (surviving navigation between tabs, since a
// Zustand store outlives any one page's mount/unmount) and reset back to the seed list on a
// hard refresh. When a real food-catalog API exists, `addFood` is the seam it plugs into.
export const useFoodCatalogStore = create((set, get) => ({
  foods: mockFoods,

  addFood: (input) => {
    const food = {
      id: generateId('food'),
      name: input.name.trim(),
      aliases: [],
      category: 'custom',
      servingLabel: input.servingLabel.trim(),
      servingGrams: 0,
      nutrients: {
        calories: Number(input.calories) || 0,
        proteinG: Number(input.proteinG) || 0,
        carbsG: Number(input.carbsG) || 0,
        fatG: Number(input.fatG) || 0,
        fiberG: Number(input.fiberG) || 0,
        sugarG: Number(input.sugarG) || 0,
        sodiumMg: Number(input.sodiumMg) || 0,
      },
    }
    set({ foods: [food, ...get().foods] })
    return food
  },
}))

export function useFoodCatalog() {
  return useFoodCatalogStore((state) => state.foods)
}
