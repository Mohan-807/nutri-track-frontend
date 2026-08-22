// Shared "network latency" simulator so every mock service feels like it's actually calling
// out to a server — makes the loading states (spinners, disabled buttons) meaningful now and
// means nothing needs to change visually once real requests replace these calls.
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
