import { useState, useMemo } from 'react'
import { FiltroFecha } from '../../components/agenda/FiltroFecha'
import { ColumnaAgenda } from '../../components/agenda/ColumnaAgenda'
import { useAgenda } from '../../hooks/useAgenda'
import { useSalas } from '../../hooks/useSalas'
import { BarraBusqueda } from '../../components/ui/BarraBusqueda'

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

export function Agenda() {
  const [fecha, setFecha] = useState(() => formatDate(new Date()))
  const { citas, loading: loadingCitas } = useAgenda(fecha)
  const { salas, loading: loadingSalas } = useSalas()
  const [busqueda, setBusqueda] = useState('')

  const citasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return citas
    const q = busqueda.trim().toLowerCase()
    return citas.filter((c) =>
      (c.mascota?.nombre || '').toLowerCase().includes(q) ||
      (c.cliente?.nombre || '').toLowerCase().includes(q) ||
      (c.cliente?.apellido || '').toLowerCase().includes(q)
    )
  }, [citas, busqueda])

  const citasPorSala = useMemo(() => {
    const map = {}
    citasFiltradas.forEach((cita) => {
      const salaId = cita.hueco?.sala?.id
      if (!salaId) return
      if (!map[salaId]) map[salaId] = []
      map[salaId].push(cita)
    })
    return map
  }, [citasFiltradas])

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
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6555]"
              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar mascota o cliente..."
              className="w-full pl-9 pr-3 py-2 border border-[#E8DDD0] rounded-lg text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F] focus:border-transparent placeholder:text-[#7A6555]"
            />
          </div>
          <FiltroFecha fecha={fecha} onChange={setFecha} />
        </div>
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
