import { useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '../../utils/cn'

// Lives inside ChatPage's own scroll container (not viewport-fixed) so it sits correctly above
// the bottom nav on mobile and within the content column on desktop.
export function ChatInputBar({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null)

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  function handleChange(event) {
    onChange(event.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-3 pb-safe backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex w-full max-w-2xl items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message your coach…"
          className="max-h-32 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-accent-500 dark:text-slate-950 dark:hover:bg-accent-400',
          )}
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  )
}
