import { motion } from 'framer-motion'
import { Salad, User } from 'lucide-react'
import { cn } from '../../utils/cn'
import { TypingIndicator } from './TypingIndicator'

// content === null means the assistant reply hasn't started streaming in yet.
// `model` is only set on assistant messages (the backend records which AI produced each reply,
// since automatic failover means it can differ from message to message).
export function ChatBubble({ role, content, model }) {
  const isUser = role === 'user'
  const isLoading = content == null
  // Strip the vendor prefix that some ids carry (e.g. "nvidia/nemotron-3-…") — the label is a
  // small provenance hint, not a full model identifier.
  const modelLabel = model?.includes('/') ? model.split('/').pop() : model

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-sm shadow-accent-500/30 dark:from-accent-400 dark:to-accent-600">
          <Salad className="size-3.5" />
        </span>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm md:max-w-2xl',
          isUser
            ? 'rounded-br-md bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-md shadow-accent-500/25 dark:from-accent-400 dark:to-accent-600 dark:text-slate-950'
            : 'rounded-bl-md bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-50',
        )}
      >
        {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{content}</p>}
        {!isUser && !isLoading && modelLabel && (
          <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">{modelLabel}</p>
        )}
      </div>
      {isUser && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-400 to-slate-600 text-white dark:from-slate-600 dark:to-slate-700">
          <User className="size-3.5" />
        </span>
      )}
    </motion.div>
  )
}
