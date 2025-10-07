// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Notes from './pages/notes'
import ProtectedRoute from './routes/protectedroute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

