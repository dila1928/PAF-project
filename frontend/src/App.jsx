import { Route, Routes } from 'react-router-dom'
import { AdminBookingsPage } from './pages/AdminBookingsPage'
import { BookingsPage } from './pages/BookingsPage'
import { EditResource } from './pages/EditResource'
import { HomePage } from './pages/HomePage'
import { NewBookingPage } from './pages/NewBookingPage'
import { ResourceList } from './pages/ResourceList'
import './App.css'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources" element={<ResourceList />} />
        <Route path="/resources/:id/edit" element={<EditResource />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/new" element={<NewBookingPage />} />
        <Route path="/bookings/admin" element={<AdminBookingsPage />} />
      </Routes>
    </main>
  )
}

export default App
