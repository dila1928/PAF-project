import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AddResourceForm } from '../components/facilities/AddResourceForm'
import '../components/facilities/facilities.css'
import './ResourceList.css'
import { deleteResource, fetchResources } from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'

function formatLabel(value) {
  if (value == null) return '—'
  return String(value).replaceAll('_', ' ')
}

function getStatusClass(status) {
  if (status === 'ACTIVE') return 'fc-status-active'
  if (status === 'OUT_OF_SERVICE') return 'fc-status-out'
  return 'fc-status-default'
}

export function ResourceList() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  async function loadResources() {
    setLoading(true)
    setListError(null)
    try {
      const data = await fetchResources()
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
      <header className="fc-page-header">
        <div>
          <h1 className="fc-page-title">Facilities Management</h1>
          <p className="fc-page-sub">
            Oversee and organize all campus structural assets and equipment.
          </p>
        </div>
        <button
          type="button"
          className="fc-btn fc-btn-primary fc-btn-add"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? 'Hide Form' : '+ Add Resource'}
        </button>
      </header>

      {showAdd && (
        <AddResourceForm
          onCreated={() => {
            setShowAdd(false)
            loadResources()
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      <section className="fc-card fc-list-card" aria-label="Resources list">
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
                  <th>Status</th>
                  <th>Description</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="fc-muted">
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
                        <span className={`fc-badge ${getStatusClass(r.status)}`}>
                          {formatLabel(r.status)}
                        </span>
                      </td>
                      <td>{r.description?.trim() ? r.description : '—'}</td>
                      <td>
                        <div className="fc-actions">
                          <Link
                            to={`/resources/${r.id}/edit`}
                            className="fc-btn fc-btn-ghost fc-btn-small"
                          >
                            ✎
                          </Link>
                          <button
                            type="button"
                            className="fc-btn fc-btn-danger fc-btn-small"
                            onClick={() => handleDelete(r.id)}
                          >
                            ⌫
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
        {!loading && (
          <div className="fc-table-footer">
            <span className="fc-muted fc-footer-text">
              Showing {resources.length} facilities
            </span>
            <div className="fc-pagination">
              <button type="button" className="fc-page-btn" aria-label="Previous page">
                ‹
              </button>
              <button type="button" className="fc-page-btn is-active">
                1
              </button>
              <button type="button" className="fc-page-btn">2</button>
              <button type="button" className="fc-page-btn">3</button>
              <button type="button" className="fc-page-btn" aria-label="Next page">
                ›
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
