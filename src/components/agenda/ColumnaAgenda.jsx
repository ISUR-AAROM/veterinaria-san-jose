import { HuecoCitaCard } from './HuecoCitaCard'

function getCategoryColor(nombre) {
  if (!nombre) return { bar: 'bg-[#C2570F]', light: 'bg-[#FFF3EB]', text: 'text-[#C2570F]' }
  const n = nombre.toLowerCase()
  if (n.includes('consulta')) return { bar: 'bg-[#C2570F]', light: 'bg-[#FFF3EB]', text: 'text-[#C2570F]' }
  if (n.includes('vacun') || n.includes('tratamiento')) return { bar: 'bg-[#4A7C59]', light: 'bg-[#F0F7F2]', text: 'text-[#4A7C59]' }
  if (n.includes('baño') || n.includes('esté')) return { bar: 'bg-[#8B5CF6]', light: 'bg-[#F5F3FF]', text: 'text-[#8B5CF6]' }
  if (n.includes('cirug') || n.includes('quirófano')) return { bar: 'bg-[#EF4444]', light: 'bg-[#FEF2F2]', text: 'text-[#EF4444]' }
  return { bar: 'bg-[#7A6555]', light: 'bg-[#FAF7F2]', text: 'text-[#7A6555]' }
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-[#D6C8B8]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5V8L10 10" strokeLinecap="round" />
    </svg>
  )
}

function PawIcon() {
  return (
    <svg className="w-5 h-5 text-[#D6C8B8]" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM11 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM14 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 14a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1H3v-1Z" />
      <circle cx="3" cy="8" r="1.5" />
    </svg>
  )
}

export function ColumnaAgenda({ sala, citas, huecosSinCita }) {
  const cat = sala?.categoria_sala?.nombre
  const colors = getCategoryColor(cat)

  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden min-w-[280px] flex-1 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className={`h-1.5 ${colors.bar}`} />

      <div className="px-4 py-3 border-b border-[#E8DDD0]">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#2C1A0E] truncate">
            {sala?.nombre || 'Sala sin nombre'}
          </h3>
          {cat && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.light} ${colors.text} shrink-0`}>
              {cat}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-[#7A6555]">{citas.length} cita{citas.length !== 1 ? 's' : ''}</span>
          {sala?.capacidad && (
            <>
              <span className="text-[#E8DDD0]">·</span>
              <span className="text-[11px] text-[#7A6555]">Cap. {sala.capacidad}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
        {citas.length === 0 && (!huecosSinCita || huecosSinCita.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mb-3">
              <PawIcon />
            </div>
            <p className="text-sm font-medium text-[#7A6555] font-display">Sin citas</p>
            <p className="text-xs text-[#BFB5A8] mt-0.5">No hay citas programadas para esta sala</p>
          </div>
        ) : (
          <>
            {citas.map((cita, i) => (
              <HuecoCitaCard
                key={cita.id}
                cita={cita}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
            {huecosSinCita?.map((hueco, idx) => (
              <div
                key={`empty-${hueco.id || idx}`}
                className="bg-[#FAF7F2]/50 border border-dashed border-[#E8DDD0] rounded-xl p-3"
              >
                <div className="flex items-center gap-2">
                  <ClockIcon />
                  <span className="text-xs text-[#7A6555]">
                    {hueco.hora_inicio?.slice(0, 5)} — {hueco.hora_fin?.slice(0, 5)}
                  </span>
                </div>
                <p className="text-xs text-[#BFB5A8] mt-1 ml-7">Disponible</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
