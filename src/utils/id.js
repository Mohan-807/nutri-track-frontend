// Small id helper shared by every store that creates records client-side (log entries, chat
// messages, mock accounts). Prefers crypto.randomUUID when available.
export function generateId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}
