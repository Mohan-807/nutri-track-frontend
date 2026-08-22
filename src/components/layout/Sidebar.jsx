import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Home, History, CirclePlus, User, LogOut, Salad } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuthStore } from '../../stores/authStore'
import { useUiStore } from '../../stores/uiStore'
import { Toggle } from '../ui/Toggle'

const NAV_ITEMS = [
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/today', label: 'Today', icon: Home },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/add-food', label: 'Add Food', icon: CirclePlus },
  { to: '/app/profile', label: 'Profile', icon: User },
]

// Desktop-only fixed left nav — mobile uses BottomNav instead. The active item's gradient pill
// uses the same shared-layoutId slide technique as BottomNav for a consistent premium feel.
export function Sidebar() {
  const logout = useAuthStore((state) => state.logout)
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-200 bg-white md:flex dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-md shadow-accent-500/30">
          <Salad className="size-4" />
        </span>
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">Nutri Tracker</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-linear-to-r from-accent-50 to-accent-100/60 dark:from-accent-500/15 dark:to-accent-500/5"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon
                  className={cn(
                    'size-5 transition-colors',
                    isActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-500 dark:text-slate-400',
                  )}
                />
                <span className={cn('transition-colors', isActive ? 'text-accent-700 dark:text-accent-400' : 'text-slate-600 dark:text-slate-300')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-3 dark:border-slate-700">
        <Toggle checked={theme === 'dark'} onChange={toggleTheme} label="Dark mode" />
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          <LogOut className="size-5" />
          Log out
        </button>
      </div>
    </aside>
  )
}
