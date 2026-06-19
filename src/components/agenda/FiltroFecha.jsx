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
  const mananaDate = new Date(); mananaDate.setDate(mananaDate.getDate() + 1)
  const ayerDate = new Date(); ayerDate.setDate(ayerDate.getDate() - 1)

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
    <div className="flex items-center gap-1.5 bg-white border border-[#E8DDD0] rounded-xl px-2 py-1.5 shadow-sm select-none">
      <button
        onClick={prevDay}
        className="h-8 w-8 flex items-center justify-center rounded-lg text-[#7A6555] hover:bg-[#FAF7F2] hover:text-[#2C1A0E] transition-all active:scale-95"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 4L6 8L10 12" />
        </svg>
      </button>

      <div className="min-w-[160px] text-center px-2">
        <p className="text-sm font-display text-[#2C1A0E] leading-tight">
          {displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)}
        </p>
        <p className="text-[11px] text-[#7A6555] font-sans">{fecha}</p>
      </div>

      <button
        onClick={nextDay}
        className="h-8 w-8 flex items-center justify-center rounded-lg text-[#7A6555] hover:bg-[#FAF7F2] hover:text-[#2C1A0E] transition-all active:scale-95"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 4L10 8L6 12" />
        </svg>
      </button>

      <div className="w-px h-6 bg-[#E8DDD0] mx-1" />

      <button
        onClick={hoy}
        disabled={isToday}
        className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
          isToday
            ? 'text-[#BFB5A8] cursor-default'
            : 'text-[#C2570F] hover:bg-[#FFF3EB] active:scale-95'
        }`}
      >
        Hoy
      </button>
    </div>
  )
}
