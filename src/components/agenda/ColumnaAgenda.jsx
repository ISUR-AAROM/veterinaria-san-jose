import { HuecoCitaCard } from './HuecoCitaCard'

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[#E8DDD0] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5V8L10 10" strokeLinecap="round" />
    </svg>
  )
}

export function ColumnaAgenda({ sala, citas, huecosSinCita }) {
  return (
    <div className="bg-[#FAF7F2] rounded-xl border border-[#E8DDD0] overflow-hidden min-w-[260px] flex-1">
      <div className="bg-white border-b border-[#E8DDD0] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#2C1A0E]">{sala.nombre}</h3>
      </div>
      <div className="p-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        {citas.length === 0 && huecosSinCita?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
              <ClockIcon />
            </div>
            <p className="text-xs text-[#7A6555]">Sin horarios</p>
            <p className="text-xs text-[#7A6555]">para hoy</p>
          </div>
        ) : (
          <>
            {citas.map((cita) => (
              <HuecoCitaCard key={cita.id} cita={cita} />
            ))}
            {huecosSinCita?.map((hueco, idx) => (
              <div
                key={`empty-${hueco.id || idx}`}
                className="bg-white/50 border border-dashed border-[#E8DDD0] rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <ClockIcon />
                  <span className="text-xs text-[#7A6555]">
                    {hueco.hora_inicio?.slice(0, 5)} - {hueco.hora_fin?.slice(0, 5)}
                  </span>
                </div>
                <p className="text-xs text-[#BFB5A8] mt-1 ml-5">Disponible</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
