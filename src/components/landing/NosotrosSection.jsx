import { useReveal } from '../../hooks/useReveal'

export function NosotrosSection() {
  const { ref: refContent, isVisible: visContent } = useReveal()
  const { ref: refVisual, isVisible: visVisual } = useReveal()

  return (
    <section id="nosotros" className="bg-white py-24">
      <div className="max-w-5xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div ref={refContent} className={`flex-1 transition-all duration-700 ${visContent ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <span className="text-[#C2570F] text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
              Quienes somos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C1A0E] mb-6">
              Sobre nosotros
            </h2>
            <p className="text-[#7A6555] leading-relaxed mb-8">
              En Clinica Veterinaria San Jose contamos con un equipo de
              profesionales dedicados al bienestar animal. Con anos de experiencia
              en atencion clinica, cirugia y prevencion, brindamos un servicio
              integral para perros, gatos y otras mascotas. Nuestro compromiso es
              ofrecer un trato calido y responsable en cada consulta.
            </p>
            <div className="flex gap-8">
              <div>
                <span className="text-2xl font-bold text-[#C2570F]">+500</span>
                <p className="text-xs text-[#7A6555] mt-1">Mascotas atendidas</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#C2570F]">+8</span>
                <p className="text-xs text-[#7A6555] mt-1">Anos de experiencia</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#C2570F]">+4</span>
                <p className="text-xs text-[#7A6555] mt-1">Servicios especializados</p>
              </div>
            </div>
          </div>
          <div ref={refVisual} className={`flex-1 w-full transition-all duration-700 ${visVisual ? 'animate-fade-in-right' : 'opacity-0'}`}>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FAF7F2] to-[#FFF3EB] border border-[#E8DDD0] rounded-2xl h-72 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]">
                  <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-[#C2570F]" />
                  <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-[#4A7C59]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#C2570F]" />
                </div>
                <div className="relative z-10 text-center">
                  <svg className="w-14 h-14 mx-auto mb-2 text-[#C2570F]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M16 22C16 19.7909 17.7909 18 20 18C22.2091 18 24 19.7909 24 22V24C24 26.2091 22.2091 28 20 28C17.7909 28 16 26.2091 16 24V22Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M24 24C24 21.7909 25.7909 20 28 20C30.2091 20 32 21.7909 32 24V26C32 28.2091 30.2091 30 28 30C25.7909 30 24 28.2091 24 26V24Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M20 28V32C20 34.2091 21.7909 36 24 36C26.2091 36 28 34.2091 28 32V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M24 18V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M20 14H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-[#7A6555] text-sm">Clinica Veterinaria San Jose</p>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#C2570F]/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
