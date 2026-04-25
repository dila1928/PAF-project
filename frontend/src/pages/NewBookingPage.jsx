import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import '../components/facilities/facilities.css'
import { createBooking } from '../services/bookingApi'
import { fetchResources } from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'
import { toApiTime } from '../utils/timeFormat'
import './NewBookingPage.css'

const initialForm = {
  resourceId: '',
  bookingDate: '',
  startTime: '09:00',
  endTime: '10:00',
  purpose: '',
  expectedAttendees: '',
}

function todayIsoDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function validateForm(form) {
  const errors = {}
  const minDate = todayIsoDate()
  const start = toApiTime(form.startTime)
  const end = toApiTime(form.endTime)
  const purpose = form.purpose.trim()
  const attendeesRaw = form.expectedAttendees.trim()

  if (!form.resourceId) errors.resourceId = 'Please select a resource.'
  if (!form.bookingDate) {
    errors.bookingDate = 'Please select a booking date.'
  } else if (form.bookingDate < minDate) {
    errors.bookingDate = 'Booking date cannot be in the past.'
  }

  if (!form.startTime) errors.startTime = 'Please select a start time.'
  if (!form.endTime) errors.endTime = 'Please select an end time.'
  if (start && end && start >= end) {
    errors.endTime = 'End time must be after start time.'
  }

  if (!purpose) {
    errors.purpose = 'Purpose is required.'
  } else if (purpose.length < 5) {
    errors.purpose = 'Purpose must be at least 5 characters.'
  }

  if (attendeesRaw !== '') {
    const attendees = Number(attendeesRaw)
    if (!Number.isInteger(attendees) || attendees <= 0) {
      errors.expectedAttendees = 'Expected attendees must be a positive whole number.'
    }
  }

  return errors
}

export function NewBookingPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loadingList, setLoadingList] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const minBookingDate = todayIsoDate()

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoadingList(true)
      try {
        const data = await fetchResources()
        if (!cancelled) {
          const list = Array.isArray(data) ? data : []
          setResources(list.filter((r) => r.status === 'ACTIVE'))
        }
      } catch {
        if (!cancelled) setResources([])
      } finally {
        if (!cancelled) setLoadingList(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const rid = params.get('resourceId')
    if (rid) {
      setForm((prev) => ({ ...prev, resourceId: rid }))
    }
  }, [params])

  function update(field, value) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const validationErrors = validateForm(form)
    setFieldErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the highlighted fields and try again.')
      return
    }
    setSubmitting(true)
    try {
      const attendeesRaw = form.expectedAttendees.trim()
      const payload = {
        resourceId: form.resourceId,
        bookingDate: form.bookingDate,
        startTime: toApiTime(form.startTime),
        endTime: toApiTime(form.endTime),
        purpose: form.purpose.trim(),
      }
      if (attendeesRaw !== '') {
        payload.expectedAttendees = Number(attendeesRaw)
      }
      await createBooking(payload)
      navigate('/bookings')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fc-page bk-new-page">
      <SiteNav />
      <header className="fc-page-header">
        <div>
          <h1 className="fc-page-title">Request a booking</h1>
          <p className="fc-page-sub">
            Choose an active resource, date, and time range. Overlapping requests for the same
            resource are blocked once pending or approved.
          </p>
        </div>
        <Link to="/bookings" className="fc-btn fc-btn-ghost">
          ← My bookings
        </Link>
      </header>

      <section className="fc-card" aria-label="Booking request form">
        {loadingList ? (
          <p className="fc-muted">Loading resources…</p>
        ) : resources.length === 0 ? (
          <p className="fc-error">
            No active resources available. Add or activate a resource in the catalogue first.
          </p>
        ) : (
          <form className="fc-form bk-new-form" onSubmit={handleSubmit}>
            {error && <p className="fc-error fc-field-span2">{error}</p>}
            <label className="fc-field fc-field-span2">
              Resource
              <select
                required
                value={form.resourceId}
                onChange={(e) => update('resourceId', e.target.value)}
              >
                <option value="" disabled>
                  Select a resource
                </option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {String(r.type).replaceAll('_', ' ')} ({r.location})
                  </option>
                ))}
              </select>
              {fieldErrors.resourceId && <p className="fc-error">{fieldErrors.resourceId}</p>}
            </label>
            <label className="fc-field">
              Date
              <input
                type="date"
                required
                min={minBookingDate}
                value={form.bookingDate}
                onChange={(e) => update('bookingDate', e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                onKeyDown={(e) => e.preventDefault()}
              />
              {fieldErrors.bookingDate && <p className="fc-error">{fieldErrors.bookingDate}</p>}
            </label>
            <label className="fc-field">
              Start time
              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) => update('startTime', e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                onKeyDown={(e) => e.preventDefault()}
              />
              {fieldErrors.startTime && <p className="fc-error">{fieldErrors.startTime}</p>}
            </label>
            <label className="fc-field">
              End time
              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) => update('endTime', e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                onKeyDown={(e) => e.preventDefault()}
              />
              {fieldErrors.endTime && <p className="fc-error">{fieldErrors.endTime}</p>}
            </label>
            <label className="fc-field fc-field-span2">
              Purpose
              <textarea
                required
                rows={3}
                value={form.purpose}
                onChange={(e) => update('purpose', e.target.value)}
                placeholder="Required: e.g. weekly project meeting, guest lecture, exam session…"
              />
              {fieldErrors.purpose && <p className="fc-error">{fieldErrors.purpose}</p>}
            </label>
            <label className="fc-field fc-field-span2">
              Expected attendees
              <input
                type="number"
                min={1}
                placeholder="Optional — leave blank if not applicable"
                value={form.expectedAttendees}
                onChange={(e) => update('expectedAttendees', e.target.value)}
              />
              {fieldErrors.expectedAttendees && (
                <p className="fc-error">{fieldErrors.expectedAttendees}</p>
              )}
            </label>
            <div className="fc-field-span2 bk-new-actions">
              <button type="submit" className="fc-btn fc-btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
              <Link to="/resources" className="fc-btn fc-btn-ghost">
                Browse resources
              </Link>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
