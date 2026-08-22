import { cn } from '../../utils/cn'

const PADDING_CLASSES = {
  none: '',
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
}

export function Card({ padding = 'md', interactive = false, variant = 'default', className, children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variant === 'default' && 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
        variant === 'flat' && 'bg-slate-100 dark:bg-slate-800/60',
        interactive && 'cursor-pointer transition-shadow hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/30',
        PADDING_CLASSES[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
