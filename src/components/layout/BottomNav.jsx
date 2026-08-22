import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Home, History, CirclePlus, User } from 'lucide-react'
import { cn } from '../../utils/cn'

const NAV_ITEMS = [
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/today', label: 'Today', icon: Home },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/add-food', label: 'Add Food', icon: CirclePlus },
  { to: '/app/profile', label: 'Profile', icon: User },
]

// Mobile-only (native-app-style) tab bar. The active tab gets a soft gradient pill that slides
// between tabs via a shared layoutId — the same technique iOS tab bars use. Desktop uses Sidebar.
export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-slate-200 bg-white/95 pb-safe backdrop-blur-sm md:hidden dark:border-slate-700 dark:bg-slate-900/95">
      <div className="grid h-16 grid-cols-5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="relative flex flex-col items-center justify-center gap-0.5">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active-pill"
                    className="absolute inset-x-2 inset-y-1 -z-10 rounded-2xl bg-linear-to-br from-accent-500/10 to-accent-600/15 dark:from-accent-400/15 dark:to-accent-500/10"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <motion.span whileTap={{ scale: 0.88 }} className="flex flex-col items-center gap-0.5">
                  <Icon
                    className={cn(
                      'size-5 transition-colors',
                      isActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-400 dark:text-slate-500',
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-400 dark:text-slate-500',
                    )}
                  >
                    {label}
                  </span>
                </motion.span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
