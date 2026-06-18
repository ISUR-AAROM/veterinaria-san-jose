export function ServicioSelector({ servicios, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {servicios.map((s) => {
        const activo = selected === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={`text-left bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
              activo
                ? 'border-[#C2570F] ring-2 ring-[#C2570F]/20'
                : 'border-[#E8DDD0] hover:border-[#C2570F]/30 hover:shadow-sm'
            }`}
          >
            <h4 className="text-sm font-semibold text-[#2C1A0E] mb-1">{s.nombre}</h4>
            {s.descripcion && (
              <p className="text-xs text-[#7A6555] mb-2 line-clamp-2">{s.descripcion}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#C2570F]">
                S/ {Number(s.precio).toFixed(2)}
              </span>
              <span className="text-xs text-[#7A6555] bg-[#FAF7F2] px-2 py-0.5 rounded-full">
                {s.duracion_minutos} min
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
