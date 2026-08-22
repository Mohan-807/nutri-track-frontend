// All date keys are local 'YYYY-MM-DD' strings — never Date#toISOString(), which shifts across
// the UTC boundary and would misfile entries logged near local midnight.

function pad(n) {
  return String(n).padStart(2, '0')
}

export function formatDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayKey() {
  return formatDateKey(new Date())
}

export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isToday(key) {
  return key === todayKey()
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

// Oldest -> newest, inclusive of endDate. Used by the History date strip.
export function getLastNDays(n, endDate = new Date()) {
  const days = []
  for (let i = n - 1; i >= 0; i -= 1) {
    days.push(formatDateKey(addDays(endDate, -i)))
  }
  return days
}

export function formatDisplayDate(key, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return parseDateKey(key).toLocaleDateString(undefined, options)
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}

export function formatDayLabel(key) {
  if (isToday(key)) return 'Today'
  const yesterday = formatDateKey(addDays(new Date(), -1))
  if (key === yesterday) return 'Yesterday'
  return formatDisplayDate(key)
}

// Month grid for the Calendar sheet: array of weeks, each a 7-length array of dateKey|null
// (null = padding cell outside the month). `month` is 0-indexed.
export function getMonthGrid(year, month) {
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(formatDateKey(new Date(year, month, day)))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}
