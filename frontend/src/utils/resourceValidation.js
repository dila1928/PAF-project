function parseTimeMinutes(value) {
  if (!value) return null
  const s = String(value).trim()
  const hhmm = s.length >= 5 ? s.slice(0, 5) : s
  const [h, m] = hhmm.split(':')
  const hours = Number(h)
  const minutes = Number(m)
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  return hours * 60 + minutes
}

export function validateResourceForm(form, allowedTypes, allowedStatuses) {
  const name = String(form.name ?? '').trim()
  const location = String(form.location ?? '').trim()
  const description = String(form.description ?? '').trim()
  const capacity = Number(form.capacity)
  const from = parseTimeMinutes(form.availableFrom)
  const to = parseTimeMinutes(form.availableTo)

  if (name.length < 3 || name.length > 100) {
    return 'Name must be between 3 and 100 characters.'
  }

  if (!allowedTypes.includes(form.type)) {
    return 'Please select a valid resource type.'
  }

  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 5000) {
    return 'Capacity must be a whole number between 1 and 5000.'
  }

  if (location.length < 3 || location.length > 120) {
    return 'Location must be between 3 and 120 characters.'
  }

  if (from == null || to == null) {
    return 'Please provide valid operating hours.'
  }

  if (from >= to) {
    return 'Operating "From" time must be earlier than "To" time.'
  }

  if (!allowedStatuses.includes(form.status)) {
    return 'Please select a valid resource status.'
  }

  if (description.length > 500) {
    return 'Description cannot exceed 500 characters.'
  }

  return null
}
