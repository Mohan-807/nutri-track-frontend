import { create } from 'zustand'
import { apiClient } from '../services/apiClient'
import { emptyTotals } from '../utils/nutrientMath'

// Server-owned now — GET/POST/PATCH/DELETE /logs/... (backend/app/routers/logs.py). The backend
// computes and scales every nutrient from the referenced Food row itself (create_entry in
// app/services/log_service.py) and returns the day's totals pre-summed, so `addEntry` only ever
// sends {foodId, quantity} — never a nutrient number — and totals are never re-derived here.
export const useNutritionLogStore = create((set, get) => ({
  daysByUser: {}, // userId -> { [dateKey]: { entries: [], totals: {...} } }
  statusByUser: {}, // userId -> { [dateKey]: 'idle' | 'loading' | 'loaded' | 'error' }
  errorByUser: {}, // userId -> { [dateKey]: message }
  loggedDatesByUser: {}, // userId -> string[]

  // `silent`: when a day was already loaded once this session, a page revisiting it (e.g.
  // navigating back to Today after logging food via the chat tab, which writes to the same
  // /logs endpoint without going through this store at all) needs a *refresh*, not the original
  // full-page loading spinner — that would needlessly re-blank an already-showing log on every
  // tab switch. Silent mode keeps showing the last-known data while it re-fetches in the
  // background, and swallows a failure rather than replacing good data with an error screen.
  fetchDay: async (userId, dateKey, { silent = false } = {}) => {
    if (!userId) return
    if (!silent) {
      set((state) => ({
        statusByUser: { ...state.statusByUser, [userId]: { ...state.statusByUser[userId], [dateKey]: 'loading' } },
      }))
    }
    try {
      const day = await apiClient.get(`/logs/${dateKey}`)
      set((state) => ({
        daysByUser: { ...state.daysByUser, [userId]: { ...state.daysByUser[userId], [dateKey]: day } },
        statusByUser: { ...state.statusByUser, [userId]: { ...state.statusByUser[userId], [dateKey]: 'loaded' } },
      }))
    } catch (error) {
      if (silent) return // keep showing the last-known-good day rather than an error screen
      set((state) => ({
        statusByUser: { ...state.statusByUser, [userId]: { ...state.statusByUser[userId], [dateKey]: 'error' } },
        errorByUser: { ...state.errorByUser, [userId]: { ...state.errorByUser[userId], [dateKey]: error.message } },
      }))
    }
  },

  // { foodId, quantity } only — the server looks up the Food row and computes every nutrient
  // itself. Re-fetches the day afterward so `entries`/`totals` reflect exactly what the backend
  // now holds, rather than patching them in optimistically from a locally-guessed shape.
  addEntry: async (userId, dateKey, { foodId, quantity }) => {
    const entry = await apiClient.post(`/logs/${dateKey}`, { foodId, quantity })
    await get().fetchDay(userId, dateKey)
    return entry
  },

  updateEntry: async (userId, dateKey, entryId, quantity) => {
    await apiClient.patch(`/logs/${dateKey}/${entryId}`, { quantity })
    await get().fetchDay(userId, dateKey)
  },

  removeEntry: async (userId, dateKey, entryId) => {
    await apiClient.delete(`/logs/${dateKey}/${entryId}`)
    await get().fetchDay(userId, dateKey)
  },

  fetchLoggedDates: async (userId) => {
    if (!userId) return
    const { dates } = await apiClient.get('/logs/dates')
    set((state) => ({ loggedDatesByUser: { ...state.loggedDatesByUser, [userId]: dates } }))
  },
}))

const EMPTY_ENTRIES = []

export function useDayStatus(userId, dateKey) {
  return useNutritionLogStore((state) => (userId ? (state.statusByUser[userId]?.[dateKey] ?? 'idle') : 'idle'))
}

export function useDayError(userId, dateKey) {
  return useNutritionLogStore((state) => (userId ? state.errorByUser[userId]?.[dateKey] : undefined))
}

export function useDayEntries(userId, dateKey) {
  return useNutritionLogStore((state) =>
    userId ? (state.daysByUser[userId]?.[dateKey]?.entries ?? EMPTY_ENTRIES) : EMPTY_ENTRIES,
  )
}

export function useDayTotals(userId, dateKey) {
  const totals = useNutritionLogStore((state) => (userId ? state.daysByUser[userId]?.[dateKey]?.totals : undefined))
  return totals ?? emptyTotals()
}

export function useLoggedDateKeys(userId) {
  return useNutritionLogStore((state) => (userId ? (state.loggedDatesByUser[userId] ?? EMPTY_ENTRIES) : EMPTY_ENTRIES))
}
