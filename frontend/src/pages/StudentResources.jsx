import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import computerLabImage from '../assets/computer-lab-resource.png'
import lectureHallImage from '../assets/lecture-hall-resource.png'
import { fetchResources, RESOURCE_TYPES } from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'
import './StudentResources.css'

const initialFilters = { type: '', location: '', minCapacity: '' }

function formatLabel(value) {
  if (value == null) return '—'
  return String(value).replaceAll('_', ' ')
}

function getResourceImage(type) {
  if (type === 'LECTURE_HALL') {
    return lectureHallImage
  }
  if (type === 'LAB') {
    return computerLabImage
  }
  return null
}

export function StudentResources() {
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('name-asc')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchResources()
        if (!cancelled) setResources(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) {
          setResources([])
          setError(getApiErrorMessage(err))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const availableResources = useMemo(() => {
    const list = resources.filter((r) => r.status === 'ACTIVE')
    const filtered = list.filter((r) => {
      if (filters.type && r.type !== filters.type) return false
      if (
        filters.location.trim() &&
        !String(r.location ?? '')
          .toLowerCase()
          .includes(filters.location.trim().toLowerCase())
      ) {
        return false
      }
      if (filters.minCapacity !== '' && Number(r.capacity ?? 0) < Number(filters.minCapacity)) {
        return false
      }
      return true
    })
    return filtered.sort((a, b) => {
      if (sortBy === 'name-asc') return String(a.name).localeCompare(String(b.name))
      if (sortBy === 'capacity-desc') return Number(b.capacity ?? 0) - Number(a.capacity ?? 0)
      return String(a.location ?? '').localeCompare(String(b.location ?? ''))
    })
  }, [resources, filters, sortBy])

  return (
    <div className="sr-page">
      <section className="sr-filters">
        <h2>Filter Resources</h2>
        <div className="sr-filter-grid">
          <label>
            <span>Resource Type</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {formatLabel(t)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Location</span>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Search by location..."
            />
          </label>
          <label>
            <span>Minimum Capacity</span>
            <input
              type="number"
              min={0}
              value={filters.minCapacity}
              onChange={(e) => setFilters((prev) => ({ ...prev, minCapacity: e.target.value }))}
              placeholder="Any Capacity"
            />
          </label>
          <button
            type="button"
            className="sr-clear-btn"
            onClick={() => setFilters(initialFilters)}
          >
            Clear
          </button>
        </div>
      </section>

      <div className="sr-list-head">
        <p>Showing {availableResources.length} available resources</p>
        <label>
          <span>Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name-asc">Name (A - Z)</option>
            <option value="capacity-desc">Capacity (High - Low)</option>
            <option value="location-asc">Location (A - Z)</option>
          </select>
        </label>
      </div>

      {loading ? <p className="sr-state">Loading resources...</p> : null}
      {error ? <p className="sr-state sr-error">{error}</p> : null}

      {!loading && !error && (
        <section className="sr-grid">
          {availableResources.length === 0 ? (
            <p className="sr-state">No available resources found.</p>
          ) : (
            availableResources.map((r) => (
              <article key={r.id} className="sr-card">
                {getResourceImage(r.type) ? (
                  <img
                    src={getResourceImage(r.type)}
                    alt={formatLabel(r.type)}
                    className="sr-card-cover-image"
                  />
                ) : (
                  <div className="sr-card-cover" />
                )}
                <div className="sr-card-body">
                  <div className="sr-card-title-row">
                    <h3>{r.name}</h3>
                    <span className="sr-status">Available</span>
                  </div>
                  <ul>
                    <li>{formatLabel(r.type)}</li>
                    <li>Capacity: {r.capacity ?? '—'}</li>
                    <li>{r.location ?? 'Location not set'}</li>
                  </ul>
                  <div className="sr-card-actions">
                    <button type="button">View Details</button>
                    <button type="button" className="primary">
                      Request Booking
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      <div className="sr-admin-link-wrap">
        <Link to="/resources/facilities" className="sr-admin-link">
          Go to Admin Resource Management
        </Link>
      </div>
    </div>
  )
}
