import { useState } from 'react'

export function EntradaClinicaItem({ entrada, receta }) {
  const [expandido, setExpandido] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="relative pl-5 pb-4 border-l-2 border-[#E8DDD0] last:pb-0 last:border-l-0">
      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#C2570F]" />
      <div
        className="bg-[#FAF7F2] rounded-lg p-3 space-y-1.5 cursor-pointer hover:bg-[#F5EEE5] transition-colors"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#C2570F]">
              {entrada.tipo_entrada?.nombre || 'Consulta'}
            </span>
            <svg
              className={`w-3 h-3 text-[#7A6555] transition-transform duration-200 ${expandido ? 'rotate-180' : ''}`}
              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <path d="M4 6L8 10L12 6" />
            </svg>
          </div>
          <span className="text-xs text-[#7A6555]">
            {formatDate(entrada.fecha)}
          </span>
        </div>

        {!expandido && (
          <>
            {entrada.diagnostico && (
              <div>
                <span className="text-xs font-medium text-[#7A6555]">Diagnóstico: </span>
                <span className="text-xs text-[#2C1A0E]">{entrada.diagnostico}</span>
              </div>
            )}
            {entrada.observaciones && (
              <div>
                <span className="text-xs font-medium text-[#7A6555]">Obs: </span>
                <span className="text-xs text-[#2C1A0E]">{entrada.observaciones}</span>
              </div>
            )}
          </>
        )}

        {expandido && (
          <div className="space-y-3 pt-1 animate-slide-up">
            {entrada.diagnostico && (
              <div>
                <span className="text-xs font-medium text-[#7A6555]">Diagnóstico: </span>
                <span className="text-xs text-[#2C1A0E]">{entrada.diagnostico}</span>
              </div>
            )}
            {entrada.observaciones && (
              <div>
                <span className="text-xs font-medium text-[#7A6555]">Observaciones: </span>
                <span className="text-xs text-[#2C1A0E]">{entrada.observaciones}</span>
              </div>
            )}
            {receta ? (
              <>
                {receta.receta_detalle?.length > 0 && (
                  <div className="pt-2 border-t border-[#E8DDD0]">
                    <p className="text-xs font-medium text-[#7A6555] mb-1.5">Medicamentos recetados:</p>
                    <div className="space-y-1.5">
                      {receta.receta_detalle.map((det) => (
                        <div key={det.id} className="bg-white border border-[#E8DDD0] rounded-lg p-2.5">
                          <p className="text-sm font-medium text-[#2C1A0E]">{det.medicamento}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                            {det.dosis && <p className="text-xs text-[#7A6555]">Dosis: {det.dosis}</p>}
                            {det.indicaciones && <p className="text-xs text-[#7A6555]">Indicaciones: {det.indicaciones}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-[#7A6555] pt-0.5">
                  {receta.personal?.nombre && (
                    <span>Veterinario: {receta.personal.nombre}</span>
                  )}
                  <span>{receta.firmado ? '✓ Firmada' : 'Sin firmar'}</span>
                </div>
              </>
            ) : entrada.id_cita && (
              <p className="text-xs text-[#7A6555] italic">Sin receta asociada a esta entrada</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
