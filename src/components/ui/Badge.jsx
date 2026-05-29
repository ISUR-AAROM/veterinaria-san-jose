const styles = {
  PROGRAMADA: 'bg-blue-50 text-blue-700',
  EN_ESPERA: 'bg-amber-50 text-amber-700',
  FINALIZADA: 'bg-green-50 text-green-700',
  NO_ASISTIO: 'bg-gray-50 text-gray-600',
  CANCELADA: 'bg-red-50 text-red-700',
}

export function Badge({ estado, activo, children }) {
  if (activo !== undefined) {
    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${
          activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {activo ? 'Activo' : 'Inactivo'}
      </span>
    )
  }

  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${styles[estado] || 'bg-gray-50 text-gray-600'}`}
    >
      {children || estado?.replace(/_/g, ' ')}
    </span>
  )
}
