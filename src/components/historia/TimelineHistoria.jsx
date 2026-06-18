import { EntradaClinicaItem } from './EntradaClinicaItem'

export function TimelineHistoria({ entradas, loading, recetasMap = {} }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-[#7A6555]">Cargando...</p>
      </div>
    )
  }

  if (entradas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-10 h-10 text-[#E8DDD0] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8V12L15 15" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
        <p className="text-sm font-medium text-[#2C1A0E]">Sin entradas clínicas</p>
        <p className="text-xs text-[#7A6555] mt-1">Aún no hay registros médicos para esta mascota.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {entradas.map((entrada) => (
        <EntradaClinicaItem
          key={entrada.id}
          entrada={entrada}
          receta={entrada.id_cita ? recetasMap[entrada.id_cita] : null}
        />
      ))}
    </div>
  )
}
