import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    error,
    helperText,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    className,
    id,
    ...rest
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500',
            LeadingIcon && 'pl-10',
            (TrailingIcon || isPassword) && 'pr-10',
            error ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700',
            className,
          )}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : (
          TrailingIcon && (
            <TrailingIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          )
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  )
})
