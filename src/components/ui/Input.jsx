import { useState } from 'react'

export function Input({ label, error, type = 'text', className = '', ...props }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs text-[#7A6555] font-medium">{label}</label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`w-full border rounded-lg px-3 py-2 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F] focus:border-transparent placeholder:text-[#7A6555] ${
            error ? 'border-[#B91C1C]' : 'border-[#E8DDD0]'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6555] hover:text-[#2C1A0E]"
          >
            {show ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-[#B91C1C]">{error}</p>}
    </div>
  )
}
