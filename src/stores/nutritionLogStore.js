import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/id'
import { sumNutrients, emptyTotals } from '../utils/nutrientMath'

const EMPTY_ENTRIES = []

// Today and History read this exact same store — only the dateKey passed to the hooks below
// differs (dateUtils.todayKey() vs. a picked date), so there's no separate "history store".
export const useNutritionLogStore = create(
  persist(
    (set) => ({
      logsByUser: {},

      addEntry: (userId, dateKey, entry) => {
        set((state) => {
          const userLogs = state.logsByUser[userId] ?? {}
          const day = userLogs[dateKey] ?? { date: dateKey, entries: [] }
          const newEntry = { id: generateId('entry'), loggedAt: new Date().toISOString(), ...entry }
          return {
            logsByUser: {
              ...state.logsByUser,
              [userId]: { ...userLogs, [dateKey]: { ...day, entries: [...day.entries, newEntry] } },
            },
          }
        })
      },

      removeEntry: (userId, dateKey, entryId) => {
        set((state) => {
          const userLogs = state.logsByUser[userId]
          const day = userLogs?.[dateKey]
          if (!day) return state
          return {
            logsByUser: {
              ...state.logsByUser,
              [userId]: { ...userLogs, [dateKey]: { ...day, entries: day.entries.filter((e) => e.id !== entryId) } },
            },
          }
        })
      },

      updateEntry: (userId, dateKey, entryId, partial) => {
        set((state) => {
          const userLogs = state.logsByUser[userId]
          const day = userLogs?.[dateKey]
          if (!day) return state
          return {
            logsByUser: {
              ...state.logsByUser,
              [userId]: {
                ...userLogs,
                [dateKey]: { ...day, entries: day.entries.map((e) => (e.id === entryId ? { ...e, ...partial } : e)) },
              },
            },
          }
        })
      },
    }),
    { name: 'nutri-tracker:logs' },
  ),
)

export function useDayEntries(userId, dateKey) {
  return useNutritionLogStore((state) => (userId ? state.logsByUser[userId]?.[dateKey]?.entries ?? EMPTY_ENTRIES : EMPTY_ENTRIES))
}

export function useDayTotals(userId, dateKey) {
  const entries = useDayEntries(userId, dateKey)
  return entries.length ? sumNutrients(entries) : emptyTotals()
}

export function useLoggedDateKeys(userId) {
  return useNutritionLogStore((state) => (userId ? Object.keys(state.logsByUser[userId] ?? {}).sort() : []))
}
