import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { ChatBubble } from '../../components/chat/ChatBubble'
import { ChatInputBar } from '../../components/chat/ChatInputBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAuthStore } from '../../stores/authStore'
import { useProfile } from '../../stores/profileStore'
import { useDayStatus, useDayTotals, useNutritionLogStore } from '../../stores/nutritionLogStore'
import { useChatStore, useMessages } from '../../stores/chatStore'
import { todayKey } from '../../utils/dateUtils'

export function ChatPage() {
  const userId = useAuthStore((state) => state.currentUserId)
  const profile = useProfile(userId)
  const dateKey = todayKey()
  const dayStatus = useDayStatus(userId, dateKey)
  const fetchDay = useNutritionLogStore((state) => state.fetchDay)
  const todayTotals = useDayTotals(userId, dateKey)
  const messages = useMessages(userId)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const isAssistantTyping = useChatStore((state) => state.isAssistantTyping)

  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  // todayTotals feeds into the chat's `context` (see handleSend) — this store is real now
  // (Preliminary B), so it needs its own fetch trigger; TodayPage isn't guaranteed to have run
  // first if the user opens the Chat tab directly.
  useEffect(() => {
    if (userId && dayStatus === 'idle') fetchDay(userId, dateKey)
  }, [userId, dateKey, dayStatus, fetchDay])

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
