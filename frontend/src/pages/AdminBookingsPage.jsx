import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SiteNav } from '../components/SiteNav'
import '../components/facilities/facilities.css'
import {
  approveBooking,
  cancelBooking,
  fetchAllBookings,
  rejectBooking,
} from '../services/bookingApi'
import { fetchResources } from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'
import { getSession } from '../utils/session'
import { toTimeInputValue } from '../utils/timeFormat'
import './AdminBookingsPage.css'

const initialFilters = {
  status: '',
  resourceId: '',
  userId: '',
  fromDate: '',
  toDate: '',
}

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

export function AdminBookingsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [rows, setRows] = useState([])
  const [resourceNames, setResourceNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rejectReason, setRejectReason] = useState({})
  const [busyId, setBusyId] = useState(null)
  const [sessionEpoch, setSessionEpoch] = useState(0)

  useEffect(() => {
    function bump() {
      setSessionEpoch((n) => n + 1)
    }
    window.addEventListener('campus-session-changed', bump)
    return () => window.removeEventListener('campus-session-changed', bump)
  }, [])

  const load = useCallback(async () => {
    if (getSession().role !== 'ADMIN') {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const apiFilters = {}
      if (filters.status) apiFilters.status = filters.status
      if (filters.resourceId.trim()) apiFilters.resourceId = filters.resourceId.trim()
      if (filters.userId.trim()) apiFilters.userId = filters.userId.trim()
      if (filters.fromDate) apiFilters.fromDate = filters.fromDate
      if (filters.toDate) apiFilters.toDate = filters.toDate
      const data = await fetchAllBookings(apiFilters)
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(getApiErrorMessage(e))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [filters, sessionEpoch])

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

  useEffect(() => {
    load()
  }, [load])

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  async function handleApprove(id) {
    setBusyId(id)
    try {
      await approveBooking(id)
      await load()
    } catch (e) {
      window.alert(getApiErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(id) {
    const reason = (rejectReason[id] ?? '').trim()
    if (!reason) {
      window.alert('Enter a rejection reason.')
      return
    }
    setBusyId(id)
    try {
      await rejectBooking(id, reason)
      setRejectReason((prev) => ({ ...prev, [id]: '' }))
      await load()
    } catch (e) {
      window.alert(getApiErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this approved booking as admin?')) return
    setBusyId(id)
    try {
      await cancelBooking(id)
      await load()
    } catch (e) {
      window.alert(getApiErrorMessage(e))
    } finally {
      setBusyId(null)
    }
  }

  if (getSession().role !== 'ADMIN') {
    return (
      <div className="fc-page">
        <SiteNav />
        <section className="fc-card">
          <p className="fc-error">Admin role is required. Set Role to Admin in the header.</p>
          <Link to="/bookings" className="fc-btn fc-btn-primary">
            Back to my bookings
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="fc-page bk-admin-page">
      <SiteNav />
      <header className="fc-page-header">
        <div>
          <h1 className="fc-page-title">Booking admin queue</h1>
          <p className="fc-page-sub">
            Review pending requests, approve or reject with a reason, and cancel approved bookings
            when needed.
          </p>
        </div>
        <Link to="/bookings" className="fc-btn fc-btn-ghost">
          My bookings
        </Link>
      </header>

      <section className="fc-card bk-admin-filters" aria-label="Filters">
        <div className="bk-filter-grid">
          <label className="fc-field">
            Status
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <label className="fc-field">
            Resource id
            <input
              type="text"
              value={filters.resourceId}
              onChange={(e) => handleFilterChange('resourceId', e.target.value)}
              placeholder="Exact id"
            />
          </label>
          <label className="fc-field">
            Requester user id
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
            />
          </label>
          <label className="fc-field">
            From date
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            />
          </label>
          <label className="fc-field">
            To date
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
            />
          </label>
        </div>
        <p className="fc-muted bk-filter-hint">
          Filters apply when the list reloads (change a value to refresh).
        </p>
      </section>

      <section className="fc-card" aria-label="All bookings">
        {error && <p className="fc-error">{error}</p>}
        {loading ? (
          <p className="fc-muted">Loading…</p>
        ) : (
          <div className="fc-table-wrap bk-admin-table-wrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Requester</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Reason / notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="fc-muted">
                      No bookings match the current filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((b) => (
                    <tr key={b.id}>
                      <td>{resourceNames[b.resourceId] ?? b.resourceId}</td>
                      <td>
                        <code className="bk-mono">{b.requestedByUserId}</code>
                      </td>
                      <td>{b.bookingDate}</td>
                      <td>
                        {toTimeInputValue(b.startTime)} – {toTimeInputValue(b.endTime)}
                      </td>
                      <td>{b.purpose}</td>
                      <td>
                        <span className={`fc-badge ${statusClass(b.status)}`}>
                          {formatLabel(b.status)}
                        </span>
                      </td>
                      <td>{b.decisionReason?.trim() ? b.decisionReason : '—'}</td>
                      <td>
                        <div className="bk-admin-actions">
                          {b.status === 'PENDING' && (
                            <>
                              <button
                                type="button"
                                className="fc-btn fc-btn-primary fc-btn-small"
                                disabled={busyId === b.id}
                                onClick={() => handleApprove(b.id)}
                              >
                                Approve
                              </button>
                              <div className="bk-reject-row">
                                <input
                                  type="text"
                                  className="bk-reject-input"
                                  placeholder="Rejection reason"
                                  value={rejectReason[b.id] ?? ''}
                                  onChange={(e) =>
                                    setRejectReason((prev) => ({
                                      ...prev,
                                      [b.id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  type="button"
                                  className="fc-btn fc-btn-danger fc-btn-small"
                                  disabled={busyId === b.id}
                                  onClick={() => handleReject(b.id)}
                                >
                                  Reject
                                </button>
                              </div>
                            </>
                          )}
                          {b.status === 'APPROVED' && (
                            <button
                              type="button"
                              className="fc-btn fc-btn-danger fc-btn-small"
                              disabled={busyId === b.id}
                              onClick={() => handleCancel(b.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
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
