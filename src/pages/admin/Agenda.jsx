import { useState, useMemo } from 'react'
import { FiltroFecha } from '../../components/agenda/FiltroFecha'
import { HuecoCitaCard } from '../../components/agenda/HuecoCitaCard'
import { useAgenda } from '../../hooks/useAgenda'
import { useSalas } from '../../hooks/useSalas'
import { useServicios } from '../../hooks/useServicios'
import { useSession } from '../../hooks/useSession'

function formatDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function SkeletonList() {
  return (
    <div className="space-y-2 animate-pulse">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E8DDD0] p-4 flex items-center gap-4">
          <div className="w-[52px] space-y-1">
            <div className="h-4 bg-[#F0EAE0] rounded w-full" />
            <div className="h-3 bg-[#F0EAE0] rounded w-2/3 mx-auto" />
          </div>
          <div className="w-px self-stretch bg-[#F0EAE0]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#F0EAE0] rounded w-1/3" />
            <div className="h-3 bg-[#F0EAE0] rounded w-1/2" />
            <div className="h-3 bg-[#F0EAE0] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Divider({ label, count }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#BFB5A8]">{label}</span>
      <div className="flex-1 h-px bg-[#E8DDD0]" />
      <span className="text-[11px] text-[#BFB5A8] tabular-nums">{count} cita{count !== 1 ? 's' : ''}</span>
    </div>
  )
}

function LiveDot({ connected }) {
  return (
    <div className="flex items-center gap-1.5" title={connected ? 'Conectado en tiempo real' : 'Desconectado'}>
      <span className={`relative w-2 h-2 rounded-full ${connected ? 'bg-[#4A7C59]' : 'bg-[#EF4444]'}`}>
        {connected && (
          <span className="absolute inset-0 rounded-full bg-[#4A7C59] animate-ping opacity-40" />
        )}
      </span>
      <span className="text-[11px] text-[#7A6555]">Live</span>
    </div>
  )
}

export function Agenda() {
  const [fecha, setFecha] = useState(() => formatDate(new Date()))
  const { session } = useSession()
  const { citas, loading, error, connected, lastUpdate, recargar } = useAgenda(fecha, session)
  const { salas, loading: loadingSalas, error: errorSalas } = useSalas()
  const { servicios } = useServicios()
  const [busqueda, setBusqueda] = useState('')
  const [salaFiltro, setSalaFiltro] = useState('')
  const [servicioFiltro, setServicioFiltro] = useState('')

  const salasActivas = useMemo(() => {
    return salas.filter((s) => s.is_active)
  }, [salas])

  const totalMascotas = useMemo(() => {
    return new Set(citas.map((c) => c.mascota?.id)).size
  }, [citas])

  const citasFiltradas = useMemo(() => {
    let resultado = citas

    if (salaFiltro) {
      resultado = resultado.filter((c) => c.hueco?.sala?.id === salaFiltro)
    }
    if (servicioFiltro) {
      resultado = resultado.filter((c) => c.hueco?.servicio?.id === servicioFiltro)
    }
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase()
      resultado = resultado.filter((c) =>
        (c.mascota?.nombre || '').toLowerCase().includes(q) ||
        (c.cliente?.nombre || '').toLowerCase().includes(q) ||
        (c.cliente?.apellido || '').toLowerCase().includes(q)
      )
    }

    return [...resultado].sort((a, b) => {
      const ta = a.hueco?.hora_inicio || ''
      const tb = b.hueco?.hora_inicio || ''
      return ta.localeCompare(tb)
    })
  }, [citas, salaFiltro, servicioFiltro, busqueda])

  const grupos = useMemo(() => {
    const manana = []
    const tarde = []
    const noche = []
    citasFiltradas.forEach((c) => {
      const h = parseInt((c.hueco?.hora_inicio || '00').split(':')[0], 10)
      if (h < 12) manana.push(c)
      else if (h < 18) tarde.push(c)
      else noche.push(c)
    })
    return { manana, tarde, noche }
  }, [citasFiltradas])

  const filtrosActivos = salaFiltro || servicioFiltro || busqueda.trim()

  return (
    <div className="animate-fade-in-up space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-end gap-4">
          <div>
            <h1 className="text-3xl font-display text-[#2C1A0E] leading-tight">Agenda</h1>
            <p className="text-sm text-[#7A6555] mt-1">Gestión de citas y horarios del día</p>
          </div>
          {lastUpdate && (
            <p className="text-[11px] text-[#BFB5A8] mb-[3px] hidden sm:block">
              Actualizado {lastUpdate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
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
              className="w-56 pl-9 pr-3 py-2.5 border border-[#E8DDD0] rounded-xl text-sm text-[#2C1A0E] bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#C2570F]/30 focus:border-[#C2570F] transition-all placeholder:text-[#7A6555]/60"
            />
          </div>
          <FiltroFecha fecha={fecha} onChange={setFecha} />
        </div>
      </div>

      {!loading && !error && !errorSalas && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={salaFiltro}
              onChange={(e) => setSalaFiltro(e.target.value)}
              className="border border-[#E8DDD0] rounded-xl px-3 py-2.5 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F]/30 focus:border-[#C2570F] transition-all appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="">Todas las salas</option>
              {[...salasActivas]
                .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
                .map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
            </select>
            <select
              value={servicioFiltro}
              onChange={(e) => setServicioFiltro(e.target.value)}
              className="border border-[#E8DDD0] rounded-xl px-3 py-2.5 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F]/30 focus:border-[#C2570F] transition-all appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="">Todos los servicios</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-sm ml-auto">
            <LiveDot connected={connected} />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C2570F]" />
              <span className="text-[#7A6555] tabular-nums">{citas.length} cita{citas.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4A7C59]" />
              <span className="text-[#7A6555] tabular-nums">{totalMascotas} mascota{totalMascotas !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7A6555]" />
              <span className="text-[#7A6555] tabular-nums">{salasActivas.length} sala{salasActivas.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          <span>Error al cargar citas: {error}</span>
          <button onClick={recargar} className="text-xs font-medium underline hover:no-underline">Reintentar</button>
        </div>
      )}
      {errorSalas && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          Error al cargar salas: {errorSalas}
        </div>
      )}

      {loading ? (
        <SkeletonList />
      ) : !filtrosActivos && citasFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M16 2V6M8 2V6M3 10H21" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#2C1A0E] font-display mb-1">Sin citas para hoy</h2>
          <p className="text-sm text-[#7A6555] max-w-xs">No hay citas programadas para esta fecha.</p>
        </div>
      ) : filtrosActivos && citasFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#BFB5A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7.5" />
              <path d="M21 21L16.5 16.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[#2C1A0E] mb-1">Sin resultados</h2>
          <p className="text-sm text-[#7A6555]">Prueba cambiando los filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {grupos.manana.length > 0 && (
            <>
              <Divider label="Mañana" count={grupos.manana.length} />
              {grupos.manana.map((cita, i) => (
                <div key={cita.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <HuecoCitaCard cita={cita} />
                </div>
              ))}
            </>
          )}
          {grupos.tarde.length > 0 && (
            <>
              <Divider label="Tarde" count={grupos.tarde.length} />
              {grupos.tarde.map((cita, i) => (
                <div key={cita.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <HuecoCitaCard cita={cita} />
                </div>
              ))}
            </>
          )}
          {grupos.noche.length > 0 && (
            <>
              <Divider label="Noche" count={grupos.noche.length} />
              {grupos.noche.map((cita, i) => (
                <div key={cita.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <HuecoCitaCard cita={cita} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
