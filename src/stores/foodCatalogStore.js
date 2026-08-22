import { create } from 'zustand'
import { apiClient } from '../services/apiClient'

// Server-owned catalog now — GET/POST /foods (backend/app/routers/foods.py). Fetched once into
// a flat `foods` list in the exact shape the UI already expects (id/name/aliases/category/
// servingLabel/servingGrams/nutrients), so the existing client-side filterFoods() live-search
// table (AddFoodPage) needed no changes at all — only where the list itself comes from.
export const useFoodCatalogStore = create((set, get) => ({
  foods: [],
  status: 'idle', // 'idle' | 'loading' | 'loaded' | 'error'
  error: null,

  fetchFoods: async () => {
    if (get().status === 'loading') return
    set({ status: 'loading', error: null })
    try {
      const { results } = await apiClient.get('/foods')
      set({ foods: results, status: 'loaded' })
    } catch (error) {
      set({ status: 'error', error: error.message })
    }
  },

  addFood: async (input) => {
    const food = await apiClient.post('/foods', {
      name: input.name.trim(),
      servingLabel: input.servingLabel.trim(),
      servingGrams: 0,
      calories: Number(input.calories) || 0,
      proteinG: Number(input.proteinG) || 0,
      carbsG: Number(input.carbsG) || 0,
      fatG: Number(input.fatG) || 0,
      fiberG: Number(input.fiberG) || 0,
      sugarG: Number(input.sugarG) || 0,
      sodiumMg: Number(input.sodiumMg) || 0,
    })
    set((state) => ({ foods: [food, ...state.foods] }))
    return food
  },
}))

export function useFoodCatalog() {
  return useFoodCatalogStore((state) => state.foods)
}
