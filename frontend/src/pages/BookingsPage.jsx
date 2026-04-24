import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import '../components/facilities/facilities.css'
import { cancelBooking, fetchMyBookings } from '../services/bookingApi'
import { fetchResources } from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'
import { toTimeInputValue } from '../utils/timeFormat'
import './BookingsPage.css'

function formatLabel(value) {
  if (value == null) return '—'
  return String(value).replaceAll('_', ' ')
}

function statusClass(s) {
  if (s === 'APPROVED') return 'bk-status-approved'
  if (s === 'PENDING') return 'bk-status-pending'
  if (s === 'REJECTED') return 'bk-status-rejected'
  if (s === 'CANCELLED') return 'bk-status-cancelled'
  return ''
}

export function BookingsPage() {
  const [rows, setRows] = useState([])
  const [resourceNames, setResourceNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyBookings()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(getApiErrorMessage(e))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let cancelled = false
    fetchResources()
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : []
        const m = {}
        list.forEach((r) => {
          m[r.id] = r.name
        })
        setResourceNames(m)
      })
      .catch(() => {
        if (!cancelled) setResourceNames({})
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCancel(id) {
    if (!window.confirm('Cancel this approved booking?')) return
    try {
      await cancelBooking(id)
      await load()
    } catch (e) {
      window.alert(getApiErrorMessage(e))
    }
  }

  return (
    <div className="fc-page bk-page">
      <SiteNav />
      <header className="fc-page-header">
        <div>
          <h1 className="fc-page-title">My bookings</h1>
          <p className="fc-page-sub">
            Requests you have submitted. Approved slots can be cancelled here.
          </p>
        </div>
        <div className="bk-header-actions">
          <Link to="/bookings/new" className="fc-btn fc-btn-primary">
            + New booking request
          </Link>
        </div>
      </header>

      <section className="fc-card" aria-label="My bookings list">
        {error && <p className="fc-error">{error}</p>}
        {loading ? (
          <p className="fc-muted">Loading…</p>
        ) : (
          <div className="fc-table-wrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="fc-muted">
                      No bookings yet. Create a request from Resources or use “New booking request”.
                    </td>
                  </tr>
                ) : (
                  rows.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="bk-res-name">
                          {resourceNames[b.resourceId] ?? 'Resource'}
                        </div>
                        <code className="bk-mono bk-res-id" title="Resource id">
                          {b.resourceId}
                        </code>
                      </td>
                      <td>{b.bookingDate ?? '—'}</td>
                      <td>
                        {toTimeInputValue(b.startTime)} – {toTimeInputValue(b.endTime)}
                      </td>
                      <td>{b.purpose}</td>
                      <td>{b.expectedAttendees ?? '—'}</td>
                      <td>
                        <span className={`fc-badge ${statusClass(b.status)}`}>
                          {formatLabel(b.status)}
                        </span>
                      </td>
                      <td>{b.decisionReason?.trim() ? b.decisionReason : '—'}</td>
                      <td>
                        {b.status === 'APPROVED' && (
                          <button
                            type="button"
                            className="fc-btn fc-btn-danger fc-btn-small"
                            onClick={() => handleCancel(b.id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
