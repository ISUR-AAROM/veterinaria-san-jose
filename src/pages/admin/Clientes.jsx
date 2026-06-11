import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientes } from '../../hooks/useClientes'

export function Clientes() {
  const navigate = useNavigate()
  const { clientes, loading, error, buscar } = useClientes()
  const [busqueda, setBusqueda] = useState('')

  const handleSearch = useCallback((e) => {
    const val = e.target.value
    setBusqueda(val)
    buscar(val)
  }, [buscar])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      buscar(busqueda)
    }
  }, [buscar, busqueda])

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Clientes</h1>
          <p className="text-sm text-[#7A6555] mt-1">Gestión de clientes y sus mascotas</p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6555]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre, apellido o documento..."
            className="w-80 pl-9 pr-3 py-2 border border-[#E8DDD0] rounded-lg text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F] focus:border-transparent placeholder:text-[#7A6555]"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          Error al cargar: {error}
        </div>
      )}

      <div className="w-full overflow-hidden rounded-xl border border-[#E8DDD0] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAF7F2]">
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Nombre completo</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Documento</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Teléfono</th>
              <th className="text-xs font-semibold text-[#7A6555] uppercase tracking-wide px-5 py-3.5 text-left">Mascotas activas</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-[#7A6555]">Cargando...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-[#7A6555]">
                {busqueda ? 'Sin resultados para esta búsqueda' : 'No hay clientes registrados'}
              </td></tr>
            ) : clientes.map((c) => (
              <tr key={c.id} className="border-t border-[#E8DDD0] hover:bg-[#FAF7F2] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-[#2C1A0E]">{c.nombre} {c.apellido}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-[#2C1A0E]">{c.tipo_documento?.nombre} {c.numero_documento}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-[#2C1A0E]">{c.telefono || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-[#2C1A0E]">{c.mascotas_activas}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => navigate(`/admin/clientes/${c.id}`)}
                    className="text-xs font-medium text-[#C2570F] hover:text-[#A8480C] transition-colors"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
