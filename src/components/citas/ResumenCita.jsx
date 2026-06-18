import { Button } from '../ui/Button'

function formatFecha(fechaStr) {
  if (!fechaStr) return '--'
  const d = new Date(fechaStr + 'T00:00:00')
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatHora(hora) {
  if (!hora) return '--:--'
  return hora.slice(0, 5)
}

export function ResumenCita({ mascota, servicio, hueco, onConfirm, loading }) {
  return (
    <div className="bg-white border border-[#E8DDD0] rounded-lg p-6 space-y-4">
      <h3 className="text-sm font-semibold text-[#2C1A0E] uppercase tracking-wide">
        Resumen de la cita
      </h3>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-[#7A6555]">Mascota</p>
          <p className="text-sm font-medium text-[#2C1A0E]">{mascota?.nombre || '---'}</p>
        </div>

        <div>
          <p className="text-xs text-[#7A6555]">Servicio</p>
          <p className="text-sm font-medium text-[#2C1A0E]">{servicio?.nombre || '---'}</p>
          {servicio?.precio && (
            <p className="text-xs text-[#7A6555]">
              S/ {Number(servicio.precio).toFixed(2)}
            </p>
          )}
        </div>

        {hueco && (
          <div>
            <p className="text-xs text-[#7A6555]">Horario</p>
            <p className="text-sm font-medium text-[#2C1A0E]">
              {formatFecha(hueco.fecha)} — {formatHora(hueco.hora_inicio)} a {formatHora(hueco.hora_fin)}
            </p>
            {hueco.sala && (
              <p className="text-xs text-[#7A6555]">Sala: {hueco.sala.nombre}</p>
            )}
          </div>
        )}
      </div>

      <Button className="w-full" onClick={onConfirm} disabled={loading}>
        {loading ? 'Confirmando...' : 'Confirmar reserva'}
      </Button>
    </div>
  )
}
