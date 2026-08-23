import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { ChatBubble } from '../../components/chat/ChatBubble'
import { ChatInputBar } from '../../components/chat/ChatInputBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../stores/authStore'
import { useChatStatus, useChatStore, useMessages } from '../../stores/chatStore'

export function ChatPage() {
  const userId = useAuthStore((state) => state.currentUserId)
  const chatStatus = useChatStatus(userId)
  const fetchHistory = useChatStore((state) => state.fetchHistory)
  const messages = useMessages(userId)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const isAssistantTyping = useChatStore((state) => state.isAssistantTyping)

  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  // Conversation history now lives in Postgres (Step 3) — load it once per user on mount.
  useEffect(() => {
    if (userId && chatStatus === 'idle') fetchHistory(userId)
  }, [userId, chatStatus, fetchHistory])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isAssistantTyping])

  function handleSend() {
    const text = draft.trim()
    // Also blocked until chatStatus is 'loaded': sending before history finishes fetching would
    // race fetchHistory's own store update and could clobber the just-sent optimistic message.
    if (!text || isAssistantTyping || chatStatus !== 'loaded') return
    setDraft('')
    // No client-supplied "context" (profile, today's totals) — the AI gets real data itself via
    // tools (get_day_totals, search_food, ...), which is trustworthy; a client-side JSON blob
    // the frontend claims is true would not be.
    sendMessage(userId, text)
  }

  return (
    // h-[calc(100dvh-4rem)] accounts for the mobile BottomNav's reserved space (AppLayout's pb-16);
    // on desktop there's no bottom nav, so the full viewport height is available.
    <div className="flex h-[calc(100dvh-4rem)] flex-col md:h-dvh">
      <TopBar title="Nutrition Coach" />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          {chatStatus === 'error' ? (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Couldn't load your conversation.</p>
              <Button variant="secondary" onClick={() => fetchHistory(userId)}>
                Try again
              </Button>
            </div>
          ) : chatStatus === 'loaded' && messages.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Ask your coach anything"
              description='Try "How am I doing today?" or "What should I eat for more protein?"'
              className="mt-10"
            />
          ) : chatStatus === 'loaded' ? (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatBubble key={message.id} role={message.role} content={message.content} />
              ))}
            </AnimatePresence>
          ) : (
            <div className="mt-10 flex justify-center">
              <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-accent-600 dark:border-slate-700 dark:border-t-accent-400" />
            </div>
          )}
        </div>
      </div>
      <ChatInputBar
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={isAssistantTyping || chatStatus !== 'loaded'}
      />
    </div>
  )
}
