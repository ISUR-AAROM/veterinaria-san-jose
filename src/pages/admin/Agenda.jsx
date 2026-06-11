import { useState, useMemo } from 'react'
import { FiltroFecha } from '../../components/agenda/FiltroFecha'
import { ColumnaAgenda } from '../../components/agenda/ColumnaAgenda'
import { useAgenda } from '../../hooks/useAgenda'
import { useSalas } from '../../hooks/useSalas'

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

export function Agenda() {
  const [fecha, setFecha] = useState(() => formatDate(new Date()))
  const { citas, loading: loadingCitas } = useAgenda(fecha)
  const { salas, loading: loadingSalas } = useSalas()

  const citasPorSala = useMemo(() => {
    const map = {}
    citas.forEach((cita) => {
      const salaId = cita.hueco?.sala?.id
      if (!salaId) return
      if (!map[salaId]) map[salaId] = []
      map[salaId].push(cita)
    })
    return map
  }, [citas])

  const salasActivas = useMemo(() => {
    return salas.filter((s) => s.is_active)
  }, [salas])

  const loading = loadingCitas || loadingSalas

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Agenda del día</h1>
          <p className="text-sm text-[#7A6555] mt-1">Gestión de citas y horarios</p>
        </div>
        <FiltroFecha fecha={fecha} onChange={setFecha} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-[#7A6555]">Cargando agenda...</p>
        </div>
      ) : salasActivas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M16 2V6M8 2V6M3 10H21" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">Sin salas activas</h2>
          <p className="text-sm text-[#7A6555] max-w-xs">No hay salas disponibles. Crea una en Catálogos &gt; Salas.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {salasActivas.map((sala) => (
            <ColumnaAgenda
              key={sala.id}
              sala={sala}
              citas={citasPorSala[sala.id] || []}
              huecosSinCita={[]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
