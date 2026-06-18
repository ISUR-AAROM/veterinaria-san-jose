import { EntradaClinicaItem } from '../historia/EntradaClinicaItem'

export function HistoriaClinicaPanel({ entradas, loading, recetasMap = {} }) {
  return (
    <div className="bg-white border border-[#E8DDD0] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[#2C1A0E] mb-4">Historia clínica</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-xs text-[#7A6555]">Cargando...</p>
        </div>
      ) : entradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="w-8 h-8 text-[#E8DDD0] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 8V12L15 15" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <p className="text-xs text-[#7A6555]">Sin entradas previas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entradas.map((entrada) => (
            <EntradaClinicaItem
              key={entrada.id}
              entrada={entrada}
              receta={entrada.id_cita ? recetasMap[entrada.id_cita] : null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
