import { Link } from 'react-router-dom'

export function MisCitas() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Mis citas</h1>
          <p className="text-sm text-[#7A6555] mt-1">Historial y proximas citas</p>
        </div>
        <Link
          to="/cliente/citas/nueva"
          className="inline-flex items-center gap-2 bg-[#C2570F] text-white font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#A8480C] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 3V13M3 8H13" />
          </svg>
          Nueva cita
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2V6M8 2V6M3 10H21" strokeLinecap="round" />
            <circle cx="12" cy="15" r="2" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">Proximamente</h2>
        <p className="text-sm text-[#7A6555] max-w-xs">Tus citas programadas y el historial apareceran aqui.</p>
      </div>
    </div>
  )
}
