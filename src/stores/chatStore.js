import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/id'
import { getReply } from '../services/chatService'

const EMPTY_MESSAGES = []

export const useChatStore = create(
  persist(
    (set) => ({
      threadsByUser: {},
      isAssistantTyping: false,

      // Appends the user message, a "typing" assistant placeholder (content: null), then streams
      // the mocked reply into that same placeholder via chatService's onChunk callback — the
      // exact shape a real streaming endpoint would fill in later.
      sendMessage: async (userId, content, context = {}) => {
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

        const updateAssistantMessage = (text) => {
          set((state) => ({
            threadsByUser: {
              ...state.threadsByUser,
              [userId]: (state.threadsByUser[userId] ?? []).map((message) =>
                message.id === assistantMessageId ? { ...message, content: text } : message,
              ),
            },
          }))
        }

        await getReply(content, context, updateAssistantMessage)
        set({ isAssistantTyping: false })
      },

      clearThread: (userId) => {
        set((state) => ({ threadsByUser: { ...state.threadsByUser, [userId]: [] } }))
      },
    }),
    { name: 'nutri-tracker:chat' },
  ),
)

export function useMessages(userId) {
  return useChatStore((state) => (userId ? state.threadsByUser[userId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES))
}
