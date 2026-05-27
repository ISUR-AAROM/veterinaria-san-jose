import { useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function NavbarPublico() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const scrollTo = useCallback((e, id) => {
    if (!isLanding) return
    e.preventDefault()
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isLanding])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#E8DDD0] z-40">
      <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#C2570F] font-bold text-lg">
          <span>🐾 San José</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#2C1A0E]">
          <Link to="/" onClick={(e) => scrollTo(e, null)} className="hover:text-[#C2570F] transition-colors">Inicio</Link>
          <Link to="/#servicios" onClick={(e) => scrollTo(e, 'servicios')} className="hover:text-[#C2570F] transition-colors">Servicios</Link>
          <Link to="/#nosotros" onClick={(e) => scrollTo(e, 'nosotros')} className="hover:text-[#C2570F] transition-colors">Nosotros</Link>
          <Link to="/#contacto" onClick={(e) => scrollTo(e, 'contacto')} className="hover:text-[#C2570F] transition-colors">Contacto</Link>
          <Link
            to="/login"
            className="bg-[#C2570F] text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#A8480C] transition-colors"
          >
            Ingresar
          </Link>
        </div>
      </div>
    </nav>
  )
}
