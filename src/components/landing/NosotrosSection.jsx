import { useReveal } from '../../hooks/useReveal'
import aboutUsSrc from '../../assets/about_us.png'

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
              <div className="border border-[#E8DDD0] rounded-2xl overflow-hidden">
                <img
                  src={aboutUsSrc}
                  alt="Clinica Veterinaria San Jose"
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#C2570F]/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
