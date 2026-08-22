import { cn } from '../../utils/cn'

export function TopBar({ title, leadingAction, trailingAction, className }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex min-h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 pt-safe backdrop-blur-sm md:px-6 dark:border-slate-700/80 dark:bg-slate-900/90',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {leadingAction}
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl dark:text-slate-50">{title}</h1>
      </div>
      {trailingAction && <div className="flex items-center gap-2">{trailingAction}</div>}
    </header>
  )
}
