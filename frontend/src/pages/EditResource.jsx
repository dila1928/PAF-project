import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EditResourceForm } from '../components/facilities/EditResourceForm'
import '../components/facilities/facilities.css'
import { getResourceById } from '../services/resourceApi'
import { getApiErrorMessage } from '../utils/apiError'
import './ResourceList.css'

export function EditResource() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isValidId = Boolean(id?.trim())

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(isValidId)
  const [error, setError] = useState(
    isValidId ? null : 'Missing resource id in the URL.',
  )

  useEffect(() => {
    if (!isValidId) {
      return
    }

    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      setResource(null)
      try {
        const data = await getResourceById(id)
        if (!cancelled) {
          setResource(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [id, isValidId])

  return (
    <div className="fc-page">
      <p className="fc-muted">
        <Link to="/">← Back to catalogue</Link>
      </p>

      {loading && <p className="fc-muted">Loading resource…</p>}
      {error && !loading && <p className="fc-error">{error}</p>}
      {resource && !loading && !error && (
        <EditResourceForm
          key={resource.id}
          resource={resource}
          onSaved={() => navigate('/')}
          onCancel={() => navigate('/')}
        />
      )}
    </div>
  )
}
