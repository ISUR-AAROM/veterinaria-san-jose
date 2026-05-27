import { useReveal } from '../../hooks/useReveal'
import { IconMapPin, IconPhone, IconMail } from '../ui/icons'

export function ContactoSection() {
  const refForm = useReveal('animate-fade-in-up')

  return (
    <section id="contacto" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#4A7C59]/[0.03] blur-3xl" />
      <div className="absolute top-0 left-0 w-[25rem] h-[25rem] rounded-full bg-[#C2570F]/[0.03] blur-3xl" />

      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[#C2570F] text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">
            Comunicate con nosotros
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C1A0E]">Contactanos</h2>
        </div>

        <div ref={refForm} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E8DDD0] p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="font-bold text-[#2C1A0E] text-lg">Informacion de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#C2570F] mt-0.5 shrink-0"><IconMapPin className="w-5 h-5" /></span>
                  <div>
                    <p className="text-sm font-medium text-[#2C1A0E]">Direccion</p>
                    <p className="text-sm text-[#7A6555]">Av. Principal 123, San Miguel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C2570F] mt-0.5 shrink-0"><IconPhone className="w-5 h-5" /></span>
                  <div>
                    <p className="text-sm font-medium text-[#2C1A0E]">Telefono</p>
                    <p className="text-sm text-[#7A6555]">(01) 555 1234</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C2570F] mt-0.5 shrink-0"><IconMail className="w-5 h-5" /></span>
                  <div>
                    <p className="text-sm font-medium text-[#2C1A0E]">Email</p>
                    <p className="text-sm text-[#7A6555]">contacto@veterinaria-san-jose.pe</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E8DDD0] pt-6">
                <p className="text-xs text-[#7A6555] leading-relaxed">
                  Horario de atencion:
                  <br />
                  Lun - Vie: 9:00 am - 7:00 pm
                  <br />
                  Sab: 9:00 am - 1:00 pm
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-[#2C1A0E] text-lg">Envia un mensaje</h3>
              <div>
                <label className="text-xs text-[#7A6555] font-medium block mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F]/30 focus:border-[#C2570F] transition-all placeholder:text-[#7A6555]"
                />
              </div>
              <div>
                <label className="text-xs text-[#7A6555] font-medium block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F]/30 focus:border-[#C2570F] transition-all placeholder:text-[#7A6555]"
                />
              </div>
              <div>
                <label className="text-xs text-[#7A6555] font-medium block mb-1">Mensaje</label>
                <textarea
                  rows="3"
                  placeholder="Escribe tu mensaje..."
                  className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm text-[#2C1A0E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C2570F]/30 focus:border-[#C2570F] transition-all placeholder:text-[#7A6555] resize-none"
                />
              </div>
              <button
                type="button"
                className="bg-[#C2570F] text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#A8480C] transition-colors w-full"
              >
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
