import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'

export function HuecoCitaCard({ cita }) {
  const navigate = useNavigate()

  const formatHora = (hora) => {
    if (!hora) return '--:--'
    return hora.slice(0, 5)
  }

  if (!cita) {
    return null
  }

  const horaInicio = cita.hueco?.hora_inicio
  const horaFin = cita.hueco?.hora_fin

  return (
    <div
      className="bg-white border border-[#E8DDD0] rounded-lg p-3 hover:shadow-sm hover:border-[#C2570F]/30 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/admin/citas/${cita.id}`)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#C2570F]">
          {formatHora(horaInicio)} - {formatHora(horaFin)}
        </span>
        <Badge estado={cita.estado} />
      </div>
      <p className="text-sm font-medium text-[#2C1A0E] truncate">
        {cita.mascota?.nombre || 'Mascota'}
      </p>
      <p className="text-xs text-[#7A6555] truncate">
        {cita.cliente?.nombre || ''} {cita.cliente?.apellido || ''}
      </p>
      <p className="text-xs text-[#7A6555] truncate mt-0.5">
        {cita.hueco?.servicio?.nombre || ''}
      </p>
    </div>
  )
}
