<<<<<<< HEAD
import { Route, Routes, useLocation } from 'react-router-dom'
import { TopNav } from './components/layout/TopNav'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLayout } from './pages/AdminLayout'
=======
import { Route, Routes } from 'react-router-dom'
import { AdminBookingsPage } from './pages/AdminBookingsPage'
import { BookingsPage } from './pages/BookingsPage'
>>>>>>> e01031bc289205fd1597bf410baaa83ae618f1d9
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

  return (
    <main>
      {!isAdminArea && <TopNav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/resources/available" element={<StudentResources />} />
        <Route path="/resources" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="facilities" element={<ResourceList />} />
          <Route path=":id/edit" element={<EditResource />} />
        </Route>
=======
        <Route path="/resources" element={<ResourceList />} />
        <Route path="/resources/:id/edit" element={<EditResource />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/new" element={<NewBookingPage />} />
        <Route path="/bookings/admin" element={<AdminBookingsPage />} />
>>>>>>> e01031bc289205fd1597bf410baaa83ae618f1d9
      </Routes>
    </main>
  )
}

export default App
