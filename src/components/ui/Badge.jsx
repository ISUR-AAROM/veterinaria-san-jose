const styles = {
  PROGRAMADA: 'bg-blue-50 text-blue-700',
  EN_ESPERA: 'bg-amber-50 text-amber-700',
  FINALIZADA: 'bg-green-50 text-green-700',
  NO_ASISTIO: 'bg-gray-50 text-gray-600',
  CANCELADA: 'bg-red-50 text-red-700',
}

export function Badge({ estado }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${styles[estado] || 'bg-gray-50 text-gray-600'}`}
    >
      {estado?.replace(/_/g, ' ')}
    </span>
  )
}
