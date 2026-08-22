import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const VARIANT_CLASSES = {
  primary:
    'bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-lg shadow-accent-500/30 hover:from-accent-500 hover:to-accent-800 hover:shadow-accent-500/40 dark:from-accent-400 dark:to-accent-600 dark:text-slate-950 dark:shadow-accent-500/20',
  secondary:
    'border border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  ghost: 'bg-transparent text-accent-600 hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-500/10',
  danger: 'bg-transparent text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10',
}

const SIZE_CLASSES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="size-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="size-4" />}
        </>
      )}
    </button>
  )
}
