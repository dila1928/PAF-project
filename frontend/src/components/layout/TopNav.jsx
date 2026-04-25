import { NavLink } from 'react-router-dom'
import './TopNav.css'

function getNavLinkClass({ isActive }) {
  return isActive ? 'topnav-link is-active' : 'topnav-link'
}

export function TopNav() {
  return (
    <header className="topnav">
      <div className="topnav-brand">
        <div className="topnav-brand-icon">🏛</div>
        <div>
          <p className="topnav-brand-title">Smart Campus</p>
          <p className="topnav-brand-subtitle">Operations Hub</p>
        </div>
      </div>
      <nav className="topnav-links" aria-label="Main navigation">
        <NavLink to="/" className={getNavLinkClass} end>
          Home
        </NavLink>
        <NavLink to="/resources/available" className={getNavLinkClass}>
          Resources
        </NavLink>
        <span className="topnav-link is-muted">Bookings</span>
        <span className="topnav-link is-muted">Tickets</span>
        <span className="topnav-link is-muted">Notifications</span>
        <span className="topnav-link is-muted">About</span>
      </nav>
      <div className="topnav-auth">
        <button type="button" className="topnav-auth-btn topnav-auth-btn-light">
          Login
        </button>
        <button type="button" className="topnav-auth-btn topnav-auth-btn-primary">
          Sign Up
        </button>
      </div>
    </header>
  )
}
