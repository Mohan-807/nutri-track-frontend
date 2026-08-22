import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function Toggle({ checked, onChange, label, className }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3', className)}>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
          checked ? 'bg-accent-600 dark:bg-accent-500' : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <motion.span
          className="inline-block size-5 rounded-full bg-white shadow"
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </label>
  )
}
