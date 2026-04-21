/** Normalize backend LocalTime JSON ("HH:mm:ss") for <input type="time" /> ("HH:mm"). */
export function toTimeInputValue(value) {
  if (value == null || value === '') return ''
  const s = String(value)
  return s.length >= 5 ? s.slice(0, 5) : s
}

/** Send "HH:mm" or "HH:mm:ss" as LocalTime-friendly string. */
export function toApiTime(value) {
  if (value == null || value === '') return null
  const s = String(value).trim()
  if (s.length === 5) return `${s}:00`
  return s
}
