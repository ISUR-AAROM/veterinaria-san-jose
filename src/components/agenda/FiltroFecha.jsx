function localDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseLocalDate(str) {
  if (!str) return new Date()
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(dateStr) {
  const hoy = localDateStr(new Date())
  const ayerDate = new Date()
  ayerDate.setDate(ayerDate.getDate() - 1)
  const mananaDate = new Date()
  mananaDate.setDate(mananaDate.getDate() + 1)

  if (dateStr === hoy) return 'Hoy'
  if (dateStr === localDateStr(mananaDate)) return 'Mañana'
  if (dateStr === localDateStr(ayerDate)) return 'Ayer'
  return parseLocalDate(dateStr).toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export function FiltroFecha({ fecha, onChange }) {
  const prevDay = () => {
    const d = parseLocalDate(fecha)
    d.setDate(d.getDate() - 1)
    onChange(localDateStr(d))
  }

  const nextDay = () => {
    const d = parseLocalDate(fecha)
    d.setDate(d.getDate() + 1)
    onChange(localDateStr(d))
  }

  const hoy = () => onChange(localDateStr(new Date()))

  const displayLabel = formatDisplay(fecha)
  const isToday = localDateStr(new Date()) === fecha

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
