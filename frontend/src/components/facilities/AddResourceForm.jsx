import { useState } from 'react'
import {
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
  createResource,
} from '../../services/resourceApi'
import { getApiErrorMessage } from '../../utils/apiError'
import { toApiTime } from '../../utils/timeFormat'
import './facilities.css'

const initialForm = {
  name: '',
  type: 'LECTURE_HALL',
  capacity: 1,
  location: '',
  availableFrom: '09:00',
  availableTo: '17:00',
  status: 'ACTIVE',
  description: '',
}

export function AddResourceForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        capacity: Number(form.capacity),
        location: form.location.trim(),
        availableFrom: toApiTime(form.availableFrom),
        availableTo: toApiTime(form.availableTo),
        status: form.status,
        description: form.description.trim() || undefined,
      }
      await createResource(payload)
      setForm(initialForm)
      onCreated?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="fc-card" aria-label="Add resource">
      <div className="fc-card-header">
        <h2 className="fc-card-title">Add resource</h2>
        {onCancel && (
          <button type="button" className="fc-btn fc-btn-ghost" onClick={onCancel}>
            Close
          </button>
        )}
      </div>
      <form className="fc-form" onSubmit={handleSubmit}>
        <label className="fc-field">
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </label>
        <label className="fc-field">
          <span>Type</span>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="fc-field">
          <span>Capacity</span>
          <input
            type="number"
            required
            min={1}
            value={form.capacity}
            onChange={(e) => update('capacity', e.target.value)}
          />
        </label>
        <label className="fc-field fc-field-span2">
          <span>Location</span>
          <input
            required
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </label>
        <label className="fc-field">
          <span>Available from</span>
          <input
            type="time"
            required
            value={form.availableFrom}
            onChange={(e) => update('availableFrom', e.target.value)}
          />
        </label>
        <label className="fc-field">
          <span>Available to</span>
          <input
            type="time"
            required
            value={form.availableTo}
            onChange={(e) => update('availableTo', e.target.value)}
          />
        </label>
        <label className="fc-field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          >
            {RESOURCE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="fc-field fc-field-span2">
          <span>Description (optional)</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </label>
        {error && <p className="fc-error fc-field-span2">{error}</p>}
        <div className="fc-actions fc-field-span2">
          <button
            type="submit"
            className="fc-btn fc-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Create resource'}
          </button>
        </div>
      </form>
    </section>
  )
}
