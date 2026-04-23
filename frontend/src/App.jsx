import { Route, Routes } from 'react-router-dom'
import { EditResource } from './pages/EditResource'
import { HomePage } from './pages/HomePage'
import { ResourceList } from './pages/ResourceList'
import './App.css'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resources" element={<ResourceList />} />
        <Route path="/resources/:id/edit" element={<EditResource />} />
      </Routes>
    </main>
  )
}

export default App
