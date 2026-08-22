import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { BottomNav } from '../components/layout/BottomNav'

// pb-16 on the content column reserves space for the fixed mobile BottomNav; md:ml-60/md:pb-0
// hands off to the fixed desktop Sidebar instead. Individual pages own their own TopBar/scrolling.
export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="flex min-h-dvh flex-col pb-16 md:ml-60 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
