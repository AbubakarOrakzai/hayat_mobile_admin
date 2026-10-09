import { Navigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAdmin()
  const location = useLocation()

  if (loading) return <p className="empty">Loading…</p>
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}