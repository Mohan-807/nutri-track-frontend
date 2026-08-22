import { cn } from '../../utils/cn'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-10 text-center', className)}>
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-accent-100 to-accent-50 text-accent-500 dark:from-slate-800 dark:to-slate-800 dark:text-accent-400">
          <Icon className="size-6" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}
