import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AddResourceForm } from '../components/facilities/AddResourceForm'
import { SearchFilter } from '../components/facilities/SearchFilter'
import '../components/facilities/facilities.css'
import './ResourceList.css'
import {
  deleteResource,
  fetchResources,
  searchResources,
} from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'
import { toTimeInputValue } from '../utils/timeFormat'

const initialFilters = { type: '', location: '', minCapacity: '' }

function formatLabel(value) {
  if (value == null) return '—'
  return String(value).replaceAll('_', ' ')
}

function hasActiveFilters(f) {
  return (
    Boolean(f.type) ||
    Boolean(f.location?.trim()) ||
    (f.minCapacity !== '' && f.minCapacity != null)
  )
}

export function ResourceList() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [showAdd, setShowAdd] = useState(false)

  async function loadResources(snapshot) {
    const f = snapshot !== undefined ? snapshot : filters
    setLoading(true)
    setListError(null)
    try {
      const data = hasActiveFilters(f)
        ? await searchResources(f)
        : await fetchResources()
      setResources(Array.isArray(data) ? data : [])
    } catch (err) {
      setListError(getApiErrorMessage(err))
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function initialLoad() {
      setLoading(true)
      setListError(null)
      try {
        const data = await fetchResources()
        if (!cancelled) {
          setResources(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setListError(getApiErrorMessage(err))
          setResources([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    initialLoad()
    return () => {
      cancelled = true
    }
  }, [])

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  function handleApplyFilters() {
    loadResources(filters)
  }

  function handleResetFilters() {
    setFilters(initialFilters)
    loadResources(initialFilters)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this resource? This cannot be undone.')) {
      return
    }
    try {
      await deleteResource(id)
      await loadResources()
    } catch (err) {
      window.alert(getApiErrorMessage(err))
    }
  }

  return (
    <div className="fc-page">
      <header>
        <h1 className="fc-page-title">Facilities &amp; Assets Catalogue</h1>
        <p className="fc-page-sub">
          Module A — browse, filter, add, and manage campus resources.
        </p>
      </header>

      <SearchFilter
        values={filters}
        onChange={handleFilterChange}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <div className="fc-toolbar">
        <button
          type="button"
          className="fc-btn fc-btn-primary"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? 'Hide form' : 'Add resource'}
        </button>
      </div>

      {showAdd && (
        <AddResourceForm
          onCreated={() => {
            setShowAdd(false)
            loadResources()
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      <section className="fc-card" aria-label="Resources list">
        <h2 className="fc-card-title">Resources</h2>
        {listError && <p className="fc-error">{listError}</p>}
        {loading ? (
          <p className="fc-muted">Loading…</p>
        ) : (
          <div className="fc-table-wrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="fc-muted">
                      No resources found.
                    </td>
                  </tr>
                ) : (
                  resources.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>
                        <span className="fc-badge">{formatLabel(r.type)}</span>
                      </td>
                      <td>{r.capacity ?? '—'}</td>
                      <td>{r.location ?? '—'}</td>
                      <td>
                        {toTimeInputValue(r.availableFrom)} –{' '}
                        {toTimeInputValue(r.availableTo)}
                      </td>
                      <td>{formatLabel(r.status)}</td>
                      <td>{r.description?.trim() ? r.description : '—'}</td>
                      <td>
                        <div className="fc-actions">
                          <Link
                            to={`/resources/${r.id}/edit`}
                            className="fc-btn fc-btn-ghost fc-btn-small"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="fc-btn fc-btn-danger fc-btn-small"
                            onClick={() => handleDelete(r.id)}
                          >
                            Delete
                          </button>
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
