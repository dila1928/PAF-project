import { Link } from 'react-router-dom'
import heroImage from '../assets/home-hero-campus.png'
import './HomePage.css'

const features = [
  {
    icon: '🏛',
    title: 'Facilities & Assets Catalogue',
    description: 'Browse and manage lecture halls, labs, meeting rooms, and equipment.',
    action: 'View Resources',
    to: '/resources/available',
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
      <section className="hero-card">
        <div className="hero-copy">
          <h1>Smart Campus Operations Hub</h1>
          <p>
            A unified platform to manage campus facilities, bookings, maintenance requests, and
            notifications efficiently and securely.
          </p>
          <div className="hero-actions">
            <Link to="/resources/available" className="btn-primary">
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

      <section className="section-wrap">
        <h2>Quick Actions</h2>
        <div className="quick-grid">
          <Link to="/resources/available" className="quick-item">
            <span className="quick-icon">🏛</span>
            <span>View Resources</span>
          </Link>
          <button type="button" className="quick-item">
            <span className="quick-icon">📅</span>
            <span>Make a Booking</span>
          </button>
          <button type="button" className="quick-item">
            <span className="quick-icon">🛠</span>
            <span>Report an Issue</span>
          </button>
          <button type="button" className="quick-item">
            <span className="quick-icon">🔔</span>
            <span>Check Notifications</span>
          </button>
        </div>
      </section>

      <section className="about-card">
        <div className="about-copy">
          <h2>About the System</h2>
          <p>
            Smart Campus Operations Hub is a web-based platform designed to improve campus
            operations by centralizing resource management, booking workflows, maintenance
            handling, and notifications.
          </p>
        </div>
        <div className="about-visual" aria-hidden="true">
          <div className="screen">
            <div className="screen-bar" />
            <div className="screen-chart" />
          </div>
          <div className="phone" />
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <p className="footer-brand">Smart Campus Operations Hub</p>
          <p className="footer-copy">© 2026 All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
