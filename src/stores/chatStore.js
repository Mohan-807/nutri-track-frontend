import { create } from 'zustand'
import { generateId } from '../utils/id'
import { getHistory, sendMessage as sendChatMessage } from '../services/chatService'
import { ApiError } from '../services/apiClient'

const EMPTY_MESSAGES = []

// Server-owned now — GET/POST /chat (backend/app/routers/chat.py). No `persist` middleware:
// conversation history lives in Postgres (chat_messages table), not localStorage — the backend
// is the source of truth, same as profile/foods/logs.
export const useChatStore = create((set, get) => ({
  threadsByUser: {},
  statusByUser: {}, // 'idle' | 'loading' | 'loaded' | 'error'
  isAssistantTyping: false,

  fetchHistory: async (userId) => {
    if (!userId || get().statusByUser[userId] === 'loading') return
    set((state) => ({ statusByUser: { ...state.statusByUser, [userId]: 'loading' } }))
    try {
      const messages = await getHistory()
      set((state) => ({
        threadsByUser: { ...state.threadsByUser, [userId]: messages },
        statusByUser: { ...state.statusByUser, [userId]: 'loaded' },
      }))
    } catch {
      set((state) => ({ statusByUser: { ...state.statusByUser, [userId]: 'error' } }))
    }
  },

  // Appends the user message and a "typing" assistant placeholder (content: null), then fills
  // that same placeholder in as real Server-Sent Events arrive from the backend — 'chunk'
  // events grow the text as Gemini actually generates it (real streaming now, not a fake
  // client-side reveal); 'tool_call'/'tool_result' have no dedicated UI yet, so the typing
  // indicator (content still null, no chunk received for the round in progress) is what the
  // user sees while the model is searching/logging.
  sendMessage: async (userId, content) => {
    const userMessage = { id: generateId('msg'), role: 'user', content, createdAt: new Date().toISOString() }
    const assistantMessageId = generateId('msg')

    set((state) => ({
      threadsByUser: {
        ...state.threadsByUser,
        [userId]: [
          ...(state.threadsByUser[userId] ?? []),
          userMessage,
          { id: assistantMessageId, role: 'assistant', content: null, createdAt: new Date().toISOString() },
        ],
      },
      isAssistantTyping: true,
    }))

    const patchAssistant = (patch) => {
      set((state) => ({
        threadsByUser: {
          ...state.threadsByUser,
          [userId]: (state.threadsByUser[userId] ?? []).map((message) =>
            message.id === assistantMessageId ? { ...message, ...patch } : message,
          ),
        },
      }))
    }
    const setAssistantContent = (text) => patchAssistant({ content: text })

    let streamed = ''
    try {
      await sendChatMessage(content, (event) => {
        if (event.type === 'chunk') {
          streamed += event.text
          setAssistantContent(streamed)
        } else if (event.type === 'provider') {
          // Which AI is serving this turn. Arrives before any text — and can name the fallback
          // model if the preferred provider was unavailable and the backend failed over.
          patchAssistant({ provider: event.provider, model: event.model })
        } else if (event.type === 'done') {
          patchAssistant({ content: event.reply, provider: event.provider, model: event.model })
        } else if (event.type === 'error') {
          setAssistantContent(event.message)
        }
      })
    } catch (error) {
      // A real network call can fail (server down, Gemini quota, etc.) before the stream even
      // starts — where the old mock never could. Without this, a failure would leave
      // isAssistantTyping stuck true and the placeholder frozen forever. This is just "don't
      // get stuck"; categorizing failures (retry vs. not, rate limits, timeouts) is Step 10.
      setAssistantContent(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.')
    } finally {
      set({ isAssistantTyping: false })
    }
  },
}))

export function useMessages(userId) {
  return useChatStore((state) => (userId ? (state.threadsByUser[userId] ?? EMPTY_MESSAGES) : EMPTY_MESSAGES))
}

export function useChatStatus(userId) {
  return useChatStore((state) => (userId ? (state.statusByUser[userId] ?? 'idle') : 'idle'))
}
