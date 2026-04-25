import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './AdminLayout.css'

function linkClass({ isActive }) {
  return isActive ? 'admin-side-link is-active' : 'admin-side-link'
}

function topLinkClass({ isActive }) {
  return isActive ? 'admin-topnav-link is-active' : 'admin-topnav-link'
}

export function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav className="admin-side-links">
          <NavLink to="/resources" end className={linkClass}>
            Admin Dashboard
          </NavLink>
          <NavLink to="/resources/facilities" className={linkClass}>
            Facilities
          </NavLink>
          <span className="admin-side-link is-disabled">Booking</span>
          <span className="admin-side-link is-disabled">Tickets</span>
          <span className="admin-side-link is-disabled">Notifications</span>
        </nav>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div>
              <p className="admin-topbar-kicker">Campus Management</p>
              <h1>Admin Dashboard</h1>
            </div>
            <nav className="admin-topnav" aria-label="Admin top navigation">
              <NavLink to="/resources" end className={topLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/resources/facilities" className={topLinkClass}>
                Facilities
              </NavLink>
              <span className="admin-topnav-link is-disabled">Booking</span>
              <span className="admin-topnav-link is-disabled">Tickets</span>
              <span className="admin-topnav-link is-disabled">Notifications</span>
            </nav>
          </div>
          <div className="admin-topbar-actions">
            <div className="admin-topbar-user">
              <span>Admin</span>
            </div>
            <button
              type="button"
              className="admin-logout-btn"
              onClick={() => navigate('/')}
            >
              Logout
            </button>
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  )
}
