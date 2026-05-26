export function Select({ label, error, options = [], className = '', placeholder = 'Seleccionar...', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs text-[#7A6555] font-medium">{label}</label>
      )}
      <select
        className={`w-full border rounded-lg px-3 py-2 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F] focus:border-transparent ${
          error ? 'border-[#B91C1C]' : 'border-[#E8DDD0]'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#B91C1C]">{error}</p>}
    </div>
  )
}
