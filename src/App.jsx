import { HydrationGate } from './routes/HydrationGate'
import { AppRoutes } from './routes/AppRoutes'
import { useThemeSync } from './stores/uiStore'

function App() {
  useThemeSync()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-accent-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <HydrationGate>
        <AppRoutes />
      </HydrationGate>
    </>
  )
}

export default App
