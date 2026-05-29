import { useMemo } from 'react'
import { useServicios } from '../../hooks/useServicios'
import { ServicioCard } from './ServicioCard'

export function ServiciosGrid() {
  const { servicios, loading } = useServicios()
  const items = useMemo(() => servicios.map((s, i) => ({
    ...s,
    animationDelay: `${100 + i * 100}ms`,
  })), [servicios])

  return (
    <section id="servicios" className="py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#C2570F]/30 rounded-full" />
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-12">
          <span className="text-[#C2570F] text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            Nuestra oferta
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C1A0E]">
            Servicios
          </h2>
          <p className="text-[#7A6555] mt-3 max-w-md mx-auto">
            Atencion integral para el bienestar de tu mascota
          </p>
        </div>
        {loading ? (
          <p className="text-center text-sm text-[#7A6555]">Cargando servicios...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: item.animationDelay }}>
                <ServicioCard
                  nombre={item.nombre}
                  descripcion={item.descripcion}
                  precio={item.precio}
                  duracionMinutos={item.duracion_minutos}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
