import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getSession, setSession } from '../utils/session'
import './SiteNav.css'

const linkClass = ({ isActive }) =>
  `site-nav-link${isActive ? ' is-active' : ''}`

export function SiteNav() {
  const [session, setLocal] = useState(() => getSession())

  function updateRole(e) {
    setSession({ role: e.target.value })
    setLocal(getSession())
  }

  return (
    <header className="site-nav">
      <div className="site-nav-brand">
        <span className="site-nav-icon" aria-hidden>
          🏛
        </span>
        <div>
          <p className="site-nav-title">Smart Campus</p>
          <p className="site-nav-sub">Operations Hub</p>
        </div>
      </div>
      <nav className="site-nav-links" aria-label="Module navigation">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/resources" className={linkClass}>
          Resources
        </NavLink>
        <NavLink to="/bookings" className={linkClass}>
          Bookings
        </NavLink>
        {session.role === 'ADMIN' && (
          <NavLink to="/bookings/admin" className={linkClass}>
            Admin queue
          </NavLink>
        )}
      </nav>
      <div className="site-nav-session" title="Demo identity (replace with real auth later)">
        <label className="site-nav-session-field">
          <span>User</span>
          <input
            type="text"
            value={session.userId}
            onChange={(e) => {
              setSession({ userId: e.target.value })
              setLocal(getSession())
            }}
          />
        </label>
        <label className="site-nav-session-field">
          <span>Role</span>
          <select value={session.role} onChange={updateRole}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
      </div>
    </header>
  )
}
