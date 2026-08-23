import { apiClient } from './apiClient'
import { todayKey } from '../utils/dateUtils'

// Real backend now — GET/POST /chat (backend/app/routers/chat.py → chat_service →
// llm_service → Gemini). The backend persists every turn and replays recent history back to
// the LLM itself, so this file only ever sends the newest message — never the whole thread.
export async function getHistory() {
  const { messages } = await apiClient.get('/chat')
  return messages
}

// Real Server-Sent Events now (Step 9) — POST /chat streams the reply incrementally instead of
// returning one JSON blob. `onEvent` is called once per event, in order:
//   {type: 'chunk', text}            — a piece of the model's final answer, as it's generated
//   {type: 'tool_call', name, args}  — the model is calling a backend tool (e.g. search_food)
//   {type: 'tool_result', name, success} — that tool's outcome
//   {type: 'done', reply}            — always last on success; the complete final text
//   {type: 'error', message}         — replaces 'done' if something failed
// This file only knows the SSE wire format (`data: <json>\n\n`); parsing that is what belongs
// here, not in chatStore.
export async function sendMessage(userMessage, onEvent) {
  // The backend has no stored per-user timezone, so a tool defaulting to "today" (e.g.
  // log_food_entry with no date, when the user says "I just ate X") would otherwise use the
  // server's UTC date — which disagrees with the user's actual local day for hours around
  // midnight and silently misfiles the entry. Sending the browser's own local date (the exact
  // value TodayPage itself uses) keeps both in agreement.
  const response = await apiClient.postStream('/chat', { message: userMessage, clientDate: todayKey() })
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      for (const line of block.split('\n')) {
        if (line.startsWith('data: ')) onEvent(JSON.parse(line.slice('data: '.length)))
      }
      boundary = buffer.indexOf('\n\n')
    }
  }
}
