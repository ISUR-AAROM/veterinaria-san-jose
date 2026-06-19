import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCitas } from '../../hooks/useCitas'
import { getClienteId } from '../../lib/auth'
import { CitaCard } from '../../components/citas/CitaCard'
import { CancelacionModal } from '../../components/citas/CancelacionModal'
import { EmptyState } from '../../components/ui/EmptyState'

function hoyString() {
  return new Date().toISOString().split('T')[0]
}

export function MisCitas() {
  const [idCliente, setIdCliente] = useState(null)
  const [tab, setTab] = useState('proximas')
  const [citaCancelar, setCitaCancelar] = useState(null)
  const [loadingCliente, setLoadingCliente] = useState(true)

  useEffect(() => {
    getClienteId()
      .then(setIdCliente)
      .finally(() => setLoadingCliente(false))
  }, [])

  const { citas, loading, error, recargar } = useCitas(idCliente)

  const hoy = hoyString()

  const proximas = useMemo(() =>
    citas.filter((c) => {
      const fecha = c.hueco?.fecha
      return (
        fecha &&
        fecha >= hoy &&
        (c.estado === 'PROGRAMADA' || c.estado === 'EN_ESPERA')
      )
    }),
    [citas, hoy]
  )

  const pasadas = useMemo(() =>
    citas.filter((c) => {
      const fecha = c.hueco?.fecha
      return !fecha || fecha < hoy || c.estado === 'FINALIZADA' || c.estado === 'CANCELADA' || c.estado === 'NO_ASISTIO'
    }),
    [citas, hoy]
  )

  const listado = useMemo(
    () => tab === 'proximas' ? proximas : pasadas,
    [tab, proximas, pasadas]
  )

  if (loadingCliente || (loading && !idCliente)) {
    return (
      <div className="animate-fade-in-up">
        <Header />
        <div className="flex items-center justify-center py-20 text-sm text-[#7A6555]">
          Cargando...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="animate-fade-in-up">
        <Header />
        <EmptyState
          icon={<svg className="w-8 h-8 text-[#B91C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8V12M12 16H12.01" strokeLinecap="round" /></svg>}
          titulo="Error al cargar citas"
          mensaje={error}
        />
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <Header />

      <div className="flex gap-4 border-b border-[#E8DDD0] mb-6">
        <button
          onClick={() => setTab('proximas')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            tab === 'proximas'
              ? 'text-[#C2570F]'
              : 'text-[#7A6555] hover:text-[#2C1A0E]'
          }`}
        >
          Próximas
          {tab === 'proximas' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2570F] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setTab('pasadas')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            tab === 'pasadas'
              ? 'text-[#C2570F]'
              : 'text-[#7A6555] hover:text-[#2C1A0E]'
          }`}
        >
          Pasadas
          {tab === 'pasadas' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2570F] rounded-full" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-[#7A6555]">
          Cargando...
        </div>
      ) : listado.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M16 2V6M8 2V6M3 10H21" strokeLinecap="round" />
              <circle cx="12" cy="15" r="2" />
            </svg>
          }
          titulo={tab === 'proximas' ? 'No tienes citas próximas' : 'No tienes citas pasadas'}
          mensaje={
            tab === 'proximas'
              ? 'Aún no tienes citas programadas. Reserva una para tu mascota.'
              : 'Aún no tienes citas en el historial.'
          }
          accion={
            tab === 'proximas' ? (
              <Link
                to="/cliente/citas/nueva"
                className="inline-flex items-center gap-2 bg-[#C2570F] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#A8480C] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3V13M3 8H13" />
                </svg>
                Reservar cita
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listado.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              onCancel={(c) => setCitaCancelar(c)}
            />
          ))}
        </div>
      )}

      <CancelacionModal
        open={!!citaCancelar}
        onClose={() => setCitaCancelar(null)}
        idCita={citaCancelar?.id}
        onConfirmada={recargar}
      />
    </div>
  )
}

function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Mis citas</h1>
        <p className="text-sm text-[#7A6555] mt-1">Historial y próximas citas</p>
      </div>
      <Link
        to="/cliente/citas/nueva"
        className="inline-flex items-center gap-2 bg-[#C2570F] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#A8480C] transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 3V13M3 8H13" />
        </svg>
        Nueva cita
      </Link>
    </div>
  )
}
