import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ServicioIcon } from '../ui/icons'
import { Button } from '../ui/Button'

export function ServicioCard({ nombre, descripcion, precio, duracionMinutos, index = 0 }) {
  const delay = 100 + index * 100
  const handleReserve = useCallback(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-center pt-8 pb-4">
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
          <ServicioIcon nombre={nombre} className="w-24 h-24" />
        </div>
      </div>
      <div className="px-6 pb-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#2C1A0E] mb-1.5">{nombre}</h3>
        <p className="text-sm text-[#7A6555] leading-relaxed mb-5 flex-1">{descripcion}</p>
        <div className="flex items-center justify-between mb-5">
          <span className="font-bold text-[#C2570F] text-xl">
            S/ {precio.toFixed(2)}
          </span>
          <span className="text-xs text-[#7A6555] bg-[#FAF7F2] px-2.5 py-1 rounded-full">
            {duracionMinutos} min
          </span>
        </div>
        <Link to="/login" className="w-full" onClick={handleReserve}>
          <Button className="w-full text-sm py-2.5 group-hover:bg-[#A8480C] transition-colors">
            Reservar cita
          </Button>
        </Link>
      </div>
    </div>
  )
}
