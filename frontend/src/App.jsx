import { Route, Routes, useLocation } from 'react-router-dom'
import { TopNav } from './components/layout/TopNav'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLayout } from './pages/AdminLayout'
import { AdminBookingsPage } from './pages/AdminBookingsPage'
import { BookingsPage } from './pages/BookingsPage'
import { EditResource } from './pages/EditResource'
import { HomePage } from './pages/HomePage'
import { NewBookingPage } from './pages/NewBookingPage'
import { ResourceList } from './pages/ResourceList'
import { StudentResources } from './pages/StudentResources'
import './App.css'

function App() {
  const { pathname } = useLocation()
  const isAdminArea =
    pathname === '/resources' ||
    pathname.startsWith('/resources/facilities') ||
    /^\/resources\/[^/]+\/edit$/.test(pathname)
  const showTopNav = pathname !== '/' && !isAdminArea

  return (
    <main>
      {showTopNav && <TopNav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources/available" element={<StudentResources />} />
        <Route path="/resources" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="facilities" element={<ResourceList />} />
          <Route path=":id/edit" element={<EditResource />} />
        </Route>
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/new" element={<NewBookingPage />} />
        <Route path="/bookings/admin" element={<AdminBookingsPage />} />
      </Routes>
    </main>
  )
}

export default App
