import { Outlet, Navigate } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'

export function RutaCliente() {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#7A6555]">
        Cargando...
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
