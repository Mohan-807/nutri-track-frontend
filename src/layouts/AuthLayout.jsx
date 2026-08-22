import { Outlet } from 'react-router-dom'

// Deliberately bare — Login/Signup and Onboarding have different internal layouts (split-panel
// vs. full-screen wizard), so this just supplies the page background and lets each page own its
// own centering/structure.
export function AuthLayout() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <Outlet />
    </main>
  )
}
