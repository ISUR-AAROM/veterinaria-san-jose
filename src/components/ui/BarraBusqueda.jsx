export function BarraBusqueda({ placeholder = 'Buscar...', value, onChange, filtros = [] }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1 basis-56">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6555]"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L14 14" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 border border-[#E8DDD0] rounded-lg text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F] focus:border-transparent placeholder:text-[#7A6555]"
        />
      </div>
      {filtros.map((filtro) => (
        <select
          key={filtro.label}
          value={filtro.value}
          onChange={(e) => filtro.onChange(e.target.value)}
          className="min-w-[140px] border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F] focus:border-transparent"
        >
          <option value="">{filtro.label}</option>
          {filtro.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}
