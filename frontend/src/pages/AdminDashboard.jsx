import { Link } from 'react-router-dom'
import './AdminDashboard.css'

const summary = [
  { icon: '🏢', value: '120', label: 'Total Facilities', tone: 'blue' },
  { icon: '📅', value: '45', label: 'Active Bookings', tone: 'green' },
  { icon: '🧰', value: '18', label: 'Open Tickets', tone: 'orange' },
  { icon: '🔔', value: '32', label: 'Notifications', tone: 'purple' },
]

const cards = [
  {
    icon: '🏛',
    label: 'Facilities',
    value: 'Manage lecture halls, labs, rooms and assets.',
    to: '/resources/facilities',
  },
  { icon: '📅', label: 'Bookings', value: 'Booking workflow module pending.', to: null },
  { icon: '🧰', label: 'Tickets', value: 'Maintenance ticket module pending.', to: null },
  { icon: '🔔', label: 'Notifications', value: 'Alerts and notices module pending.', to: null },
]

export function AdminDashboard() {
  return (
    <div className="ad-page">
      <header className="ad-header">
        <h1>Admin Dashboard</h1>
        <p>Manage campus operations from one place with quick module access.</p>
      </header>

      <section className="ad-summary-grid" aria-label="Admin summary">
        {summary.map((item) => (
          <article key={item.label} className={`ad-summary-card is-${item.tone}`}>
            <span className="ad-summary-icon">{item.icon}</span>
            <p className="ad-summary-value">{item.value}</p>
            <p className="ad-summary-label">{item.label}</p>
          </article>
        ))}
      </section>

      <section className="ad-grid" aria-label="Admin modules">
        {cards.map((card) => (
          <article key={card.label} className="ad-card">
            <div className="ad-card-head">
              <span className="ad-card-icon">{card.icon}</span>
              <h2>{card.label}</h2>
            </div>
            <p>{card.value}</p>
            {card.to ? (
              <Link to={card.to} className="ad-link">
                Open Module
              </Link>
            ) : (
              <span className="ad-link is-disabled">Coming soon</span>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
