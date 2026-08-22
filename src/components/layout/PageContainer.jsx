import { cn } from '../../utils/cn'

// Every screen's content wraps in this so breakpoint width decisions are made once, not per page.
export function PageContainer({ className, children }) {
  return <div className={cn('mx-auto w-full max-w-2xl px-4 py-6 md:px-6 lg:max-w-3xl lg:px-8', className)}>{children}</div>
}
