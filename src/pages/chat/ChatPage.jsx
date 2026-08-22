import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { ChatBubble } from '../../components/chat/ChatBubble'
import { ChatInputBar } from '../../components/chat/ChatInputBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAuthStore } from '../../stores/authStore'
import { useProfile } from '../../stores/profileStore'
import { useDayTotals } from '../../stores/nutritionLogStore'
import { useChatStore, useMessages } from '../../stores/chatStore'
import { todayKey } from '../../utils/dateUtils'

export function ChatPage() {
  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const todayTotals = useDayTotals(userId, todayKey())
  const messages = useMessages(userId)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const isAssistantTyping = useChatStore((state) => state.isAssistantTyping)

  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isAssistantTyping])

  function handleSend() {
    const text = draft.trim()
    if (!text || isAssistantTyping) return
    setDraft('')
    sendMessage(userId, text, { profile, todayTotals, targets: profile?.targets })
  }

  return (
    // h-[calc(100dvh-4rem)] accounts for the mobile BottomNav's reserved space (AppLayout's pb-16);
    // on desktop there's no bottom nav, so the full viewport height is available.
    <div className="flex h-[calc(100dvh-4rem)] flex-col md:h-dvh">
      <TopBar title="Nutrition Coach" />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          {messages.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Ask your coach anything"
              description='Try "How am I doing today?" or "What should I eat for more protein?"'
              className="mt-10"
            />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatBubble key={message.id} role={message.role} content={message.content} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      <ChatInputBar value={draft} onChange={setDraft} onSend={handleSend} disabled={isAssistantTyping} />
    </div>
  )
}
