import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { useReveal } from '../../hooks/useReveal'

export function HeroSection() {
  const refBadge = useReveal('animate-fade-in-up')
  const refTitle = useReveal('animate-fade-in-up')
  const refDesc = useReveal('animate-fade-in-up')
  const refCta = useReveal('animate-fade-in-up')

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#FAF7F2] to-[#FFF3EB]">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-[#C2570F]/[0.04] blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] rounded-full bg-[#4A7C59]/[0.04] blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#C2570F]/[0.03] blur-2xl" />

      <div className="max-w-5xl mx-auto px-8 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div ref={refBadge}>
            <span className="inline-block bg-[#C2570F]/10 text-[#C2570F] text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
              Clinica Veterinaria
            </span>
          </div>
          <div ref={refTitle}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2C1A0E] leading-[1.1] mb-6">
              Cuidamos a tu mascota<br />
              <span className="text-[#C2570F]">como parte de la familia</span>
            </h1>
          </div>
          <div ref={refDesc}>
            <p className="text-lg text-[#7A6555] max-w-2xl mx-auto mb-10 leading-relaxed">
              En San Jose Veterinaria brindamos atencion profesional con calidez y
              compromiso. Agenda una cita y conoce nuestro servicio.
            </p>
          </div>
          <div ref={refCta} className="flex items-center justify-center gap-4">
            <Link to="/login">
              <Button className="px-7 py-3.5 text-base shadow-lg shadow-[#C2570F]/20 hover:shadow-xl hover:shadow-[#C2570F]/30 transition-shadow">
                Reservar cita
              </Button>
            </Link>
            <a href="#servicios">
              <Button variant="secondary" className="px-7 py-3.5 text-base">
                Ver servicios
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
