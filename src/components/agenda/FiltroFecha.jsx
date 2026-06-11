function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function formatDisplay(date) {
  const hoy = new Date()
  const ayer = new Date(hoy)
  ayer.setDate(ayer.getDate() - 1)
  const manana = new Date(hoy)
  manana.setDate(manana.getDate() + 1)

  const opts = { weekday: 'long', day: 'numeric', month: 'long' }
  if (formatDate(date) === formatDate(hoy)) return 'Hoy'
  if (formatDate(date) === formatDate(manana)) return 'Mañana'
  if (formatDate(date) === formatDate(ayer)) return 'Ayer'
  return date.toLocaleDateString('es-PE', opts)
}

export function FiltroFecha({ fecha, onChange }) {
  const prevDay = () => {
    const d = new Date(fecha)
    d.setDate(d.getDate() - 1)
    onChange(formatDate(d))
  }

  const nextDay = () => {
    const d = new Date(fecha)
    d.setDate(d.getDate() + 1)
    onChange(formatDate(d))
  }

  const hoy = () => onChange(formatDate(new Date()))

  const displayLabel = formatDisplay(new Date(fecha))
  const isToday = formatDate(new Date()) === fecha

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={prevDay}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E8DDD0] text-[#7A6555] hover:bg-[#FAF7F2] hover:text-[#2C1A0E] transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 4L6 8L10 12" />
        </svg>
      </button>

      <div className="min-w-[140px] text-center">
        <p className="text-sm font-semibold text-[#2C1A0E]">
          {displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)}
        </p>
        <p className="text-xs text-[#7A6555]">{fecha}</p>
      </div>

      <button
        onClick={nextDay}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E8DDD0] text-[#7A6555] hover:bg-[#FAF7F2] hover:text-[#2C1A0E] transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 4L10 8L6 12" />
        </svg>
      </button>

      {!isToday && (
        <button
          onClick={hoy}
          className="text-xs font-medium text-[#C2570F] hover:text-[#A8480C] transition-colors ml-2"
        >
          Volver a hoy
        </button>
      )}
    </div>
  )
}
