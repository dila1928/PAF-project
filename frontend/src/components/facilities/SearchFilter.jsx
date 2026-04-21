import { RESOURCE_TYPES } from '../../services/resourceApi'
import './facilities.css'

const emptyOption = { value: '', label: 'Any type' }

export function SearchFilter({ values, onChange, onSearch, onReset }) {
  return (
    <section className="fc-card fc-filters" aria-label="Search filters">
      <h2 className="fc-card-title">Filter resources</h2>
      <div className="fc-filters-grid">
        <label className="fc-field">
          <span>Type</span>
          <select
            value={values.type}
            onChange={(e) => onChange('type', e.target.value)}
          >
            <option value={emptyOption.value}>{emptyOption.label}</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="fc-field">
          <span>Location contains</span>
          <input
            type="text"
            value={values.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="e.g. Block A"
            autoComplete="off"
          />
        </label>
        <label className="fc-field">
          <span>Minimum capacity</span>
          <input
            type="number"
            min={0}
            value={values.minCapacity}
            onChange={(e) => onChange('minCapacity', e.target.value)}
            placeholder="Any"
          />
        </label>
      </div>
      <div className="fc-actions">
        <button type="button" className="fc-btn fc-btn-primary" onClick={onSearch}>
          Apply filters
        </button>
        <button type="button" className="fc-btn fc-btn-ghost" onClick={onReset}>
          Clear
        </button>
      </div>
    </section>
  )
}
