import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useReveal } from '../../hooks/useReveal'
import heroBgSrc from '../../assets/landing_background.png'

export function HeroSection() {
  const { ref, isVisible } = useReveal()

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-[#FAF7F2]">
      {/* Background image with warm editorial treatment */}
      <div className="absolute inset-0">
        <img
          src={heroBgSrc}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        {/* Warm brand-toned overlay — ties the image to the palette */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C2570F]/10 via-transparent to-[#4A7C59]/15 mix-blend-multiply" />
      </div>

      {/* Atmospheric light shapes */}
      <div className="absolute top-1/4 -right-20 w-[50rem] h-[50rem] rounded-full bg-[#C2570F]/[0.05] blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-[45rem] h-[45rem] rounded-full bg-[#4A7C59]/[0.05] blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#C2570F]/[0.03] blur-2xl" />

      {/* Warm light leak from top-right */}
      <div className="absolute -top-40 -right-40 w-[70rem] h-[70rem] rounded-full bg-[#FFF3EB]/[0.25] blur-3xl" />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Bottom gradient seam — fades image into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAF7F2] to-transparent z-[1]" />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-24 relative z-10 w-full">
        <div ref={ref} className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block bg-[#C2570F]/10 text-[#C2570F] text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
              Clinica Veterinaria
            </span>
          </div>
          <div className={`transition-all duration-700 delay-150 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2C1A0E] leading-[1.1] mb-6 mt-6">
              Cuidamos a tu mascota<br />
              <span className="text-[#C2570F]">como parte de la familia</span>
            </h1>
          </div>
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-lg text-[#7A6555] max-w-2xl mx-auto mb-10 leading-relaxed">
              En San Jose Veterinaria brindamos atencion profesional con calidez y
              compromiso. Agenda una cita y conoce nuestro servicio.
            </p>
          </div>
          <div className={`transition-all duration-700 delay-450 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center justify-center gap-4">
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
      </div>
    </section>
  )
}
