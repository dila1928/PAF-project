import { useState } from 'react'
import {
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
  updateResource,
} from '../../services/resourceApi'
import { getApiErrorMessage } from '../../utils/apiError'
import { toApiTime, toTimeInputValue } from '../../utils/timeFormat'
import './facilities.css'
import './editResourceForm.css'

function toFormState(resource) {
  return {
    name: resource.name ?? '',
    type: resource.type ?? 'LECTURE_HALL',
    capacity: resource.capacity ?? 1,
    location: resource.location ?? '',
    availableFrom: toTimeInputValue(resource.availableFrom),
    availableTo: toTimeInputValue(resource.availableTo),
    status: resource.status ?? 'ACTIVE',
    description: resource.description ?? '',
  }
}

export function EditResourceForm({ resource, onSaved, onCancel }) {
  const [form, setForm] = useState(() => toFormState(resource))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!resource) {
    return null
  }

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
      await updateResource(resource.id, payload)
      onSaved?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="fc-edit-shell" aria-label="Edit resource">
      <div className="fc-edit-actions">
        <button type="button" className="fc-btn fc-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          form="resource-edit-form"
          className="fc-btn fc-btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
      <form id="resource-edit-form" className="fc-edit-grid" onSubmit={handleSubmit}>
        <article className="fc-card fc-edit-panel">
          <h2 className="fc-edit-panel-title">Core Specifications</h2>
          <div className="fc-form">
            <label className="fc-field fc-field-span2">
              <span>Resource Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </label>
            <label className="fc-field">
              <span>Resource Type</span>
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
              <span>Capacity (Persons)</span>
              <input
                type="number"
                required
                min={1}
                value={form.capacity}
                onChange={(e) => update('capacity', e.target.value)}
              />
            </label>
            <label className="fc-field fc-field-span2">
              <span>Location / Physical Address</span>
              <input
                required
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
              />
            </label>
            <label className="fc-field fc-field-span2">
              <span>Detailed Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </label>
          </div>
        </article>

        <article className="fc-card fc-edit-panel">
          <h2 className="fc-edit-panel-title">Operational State</h2>
          <label className="fc-field">
            <span>System Availability Status</span>
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
          <div className="fc-form fc-edit-hours">
            <label className="fc-field">
              <span>Operating From</span>
              <input
                type="time"
                required
                value={form.availableFrom}
                onChange={(e) => update('availableFrom', e.target.value)}
              />
            </label>
            <label className="fc-field">
              <span>Operating To</span>
              <input
                type="time"
                required
                value={form.availableTo}
                onChange={(e) => update('availableTo', e.target.value)}
              />
            </label>
          </div>
          <p className="fc-edit-note">
            Standard semester scheduling: these hours apply to normal operations.
          </p>
        </article>

        {error && <p className="fc-error fc-field-span2">{error}</p>}
        <div className="fc-actions fc-field-span2 fc-edit-mobile-submit">
          <button
            type="submit"
            className="fc-btn fc-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  )
}
