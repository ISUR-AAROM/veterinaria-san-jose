export function Salas() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Catalogos - Salas</h1>
        <p className="text-sm text-[#7A6555] mt-1">Administracion de salas y consultorios</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 7V10M12 7V10M16 7V10" strokeLinecap="round" />
            <path d="M8 14H10M14 14H16M8 18H10M14 18H16" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">Proximamente</h2>
        <p className="text-sm text-[#7A6555] max-w-xs">La gestion de salas con capacidad y equipamiento estara disponible en la proxima actualizacion.</p>
      </div>
    </div>
  )
}
