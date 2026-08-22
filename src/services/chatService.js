import { CHAT_REPLIES, FALLBACK_REPLIES } from '../data/mockChatReplies'
import { wait } from './wait'

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function resolveReply(entry, context) {
  return typeof entry === 'function' ? entry(context) : entry
}

function findReply(userMessage, context) {
  const normalized = userMessage.toLowerCase()
  const matchedGroup = CHAT_REPLIES.find((group) =>
    group.keywords.some((keyword) => normalized.includes(keyword)),
  )
  const entry = matchedGroup ? pickRandom(matchedGroup.replies) : pickRandom(FALLBACK_REPLIES)
  return resolveReply(entry, context)
}

// Mocked chat backend. `onChunk` is optional and, if given, is called with the growing reply
// string to fake a typewriter/streaming effect — a real streaming endpoint can plug into the
// exact same signature later without chatStore.sendMessage changing at all.
export async function getReply(userMessage, context = {}, onChunk) {
  await wait(400 + Math.random() * 400)
  const replyText = findReply(userMessage, context)

  if (onChunk) {
    const words = replyText.split(' ')
    let streamed = ''
    for (let i = 0; i < words.length; i += 1) {
      streamed += (i === 0 ? '' : ' ') + words[i]
      onChunk(streamed)
      await wait(30)
    }
  }

  return { success: true, reply: replyText }
}
