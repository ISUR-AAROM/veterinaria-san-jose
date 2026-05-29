import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { usePermisos } from '../../hooks/usePermisos'

export function RutaRol({ accion, fallback = '/admin/agenda' }) {
  const { loading } = useAdmin()
  const { can } = usePermisos()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-[#7A6555]">
        Cargando...
      </div>
    )
  }

  if (!can(accion)) {
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
