import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'nutri-tracker:ui' },
  ),
)

// Keeps the `.dark` class on <html> in sync with the store so every `dark:` Tailwind variant
// reacts immediately. Mount once near the app root. (index.html also sets this class inline,
// synchronously, before React mounts, to avoid a flash of the wrong theme on load.)
export function useThemeSync() {
  useEffect(() => {
    const root = document.documentElement
    const applyTheme = (theme) => root.classList.toggle('dark', theme === 'dark')
    applyTheme(useUiStore.getState().theme)
    return useUiStore.subscribe((state) => applyTheme(state.theme))
  }, [])
}
