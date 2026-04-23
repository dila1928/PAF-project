import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import './HomePage.css'

const features = [
  {
    icon: '🏛',
    title: 'Facilities & Assets Catalogue',
    description: 'Browse and manage lecture halls, labs, meeting rooms, and equipment.',
    action: 'View Resources',
    to: '/resources',
  },
  {
    icon: '📅',
    title: 'Booking Management',
    description: 'Request, approve, and manage bookings with conflict prevention.',
    action: 'Coming Soon',
  },
  {
    icon: '🛠',
    title: 'Maintenance & Incident Tickets',
    description: 'Report faults, assign technicians, and track ticket progress.',
    action: 'Coming Soon',
  },
  {
    icon: '🔔',
    title: 'Notifications',
    description: 'Receive real-time alerts for booking updates and important notices.',
    action: 'Coming Soon',
  },
]

const stats = [
  { icon: '🏛', value: '120', label: 'Total Resources', helper: 'All registered facilities and assets' },
  { icon: '📅', value: '45', label: 'Active Bookings', helper: 'Bookings confirmed and in progress' },
  { icon: '🛠', value: '18', label: 'Open Tickets', helper: 'Maintenance requests awaiting resolution' },
  { icon: '🔔', value: '32', label: 'Notifications Today', helper: 'Unread and recent notifications' },
]

export function HomePage() {
  return (
    <div className="home-shell">
      <header className="home-nav">
        <div className="home-brand">
          <div className="home-brand-icon">🏛</div>
          <div>
            <p className="home-brand-title">Smart Campus</p>
            <p className="home-brand-subtitle">Operations Hub</p>
          </div>
        </div>
        <nav className="home-links" aria-label="Main navigation">
          <Link to="/" className="home-link is-active">
            Home
          </Link>
          <Link to="/resources" className="home-link">
            Resources
          </Link>
          <span className="home-link is-muted">Bookings</span>
          <span className="home-link is-muted">Tickets</span>
          <span className="home-link is-muted">Notifications</span>
          <span className="home-link is-muted">About</span>
        </nav>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <h1>Smart Campus Operations Hub</h1>
          <p>
            A unified platform to manage campus facilities, bookings, maintenance requests, and
            notifications efficiently and securely.
          </p>
          <div className="hero-actions">
            <Link to="/resources" className="btn-primary">
              Explore Resources
            </Link>
            <button type="button" className="btn-outline">
              Make a Booking
            </button>
            <button type="button" className="btn-outline">
              Report an Issue
            </button>
          </div>
        </div>
        <img src={heroImage} alt="Campus operations overview" className="hero-image" />
      </section>

      <section className="section-wrap">
        <h2>Core Platform Features</h2>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.to ? (
                <Link to={feature.to} className="card-link">
                  {feature.action}
                </Link>
              ) : (
                <button type="button" className="card-link is-disabled">
                  {feature.action}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap">
        <h2>Overview</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-helper">{stat.helper}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 Smart Campus Operations Hub</p>
      </footer>
    </div>
  )
}
