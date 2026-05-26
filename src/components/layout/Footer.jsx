export function Footer() {
  return (
    <footer className="bg-[#2C1A0E] text-[#E8DDD0] text-sm py-10">
      <div className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <svg className="w-5 h-5 text-[#C2570F]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6V14M6 10H14" />
              </svg>
              San Jose
            </div>
            <p className="text-[#7A6555] text-xs leading-relaxed">
              Clinica veterinaria de confianza para el cuidado de tu mascota.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Contacto</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#C2570F]" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M7 12C7 12 11 8.5 11 5.5C11 3.01472 9.20914 1.5 7 1.5C4.79086 1.5 3 3.01472 3 5.5C3 8.5 7 12 7 12Z" />
                  <circle cx="7" cy="5.5" r="1.5" />
                </svg>
                Av. Principal 123, San Jose
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#C2570F]" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M12.5 10V11.5C12.5 11.775 12.275 12 12 12C7 12 3 8 3 3C3 2.725 3.225 2.5 3.5 2.5H5C5.275 2.5 5.5 2.725 5.5 3C5.5 3.55 5.6 4.075 5.8 4.55C5.85 4.675 5.825 4.825 5.75 4.9L5.05 5.6C5.85 7.05 6.95 8.15 8.4 8.95L9.1 8.25C9.175 8.175 9.325 8.15 9.45 8.2C9.925 8.4 10.45 8.5 11 8.5C11.275 8.5 11.5 8.725 11.5 9V10.5H12.5Z" />
                </svg>
                (01) 234-5678
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Horario</h4>
            <div className="space-y-1 text-xs">
              <p>Lun - Vie: 9:00 am - 7:00 pm</p>
              <p>Sab: 9:00 am - 1:00 pm</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-[#7A6555]">
          &copy; {new Date().getFullYear()} Clinica Veterinaria San Jose. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
