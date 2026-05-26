export function Plantillas() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Catalogos - Plantillas</h1>
        <p className="text-sm text-[#7A6555] mt-1">Administracion de plantillas de historia clinica</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 4H18C18.8284 4 19.5 4.67157 19.5 5.5V18.5C19.5 19.3284 18.8284 20 18 20H6C5.17157 20 4.5 19.3284 4.5 18.5V5.5C4.5 4.67157 5.17157 4 6 4Z" />
            <path d="M7.5 8H16.5M7.5 12H13M7.5 16H10.5" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">Proximamente</h2>
        <p className="text-sm text-[#7A6555] max-w-xs">La gestion de plantillas para diagnosticos y tratamientos estara disponible en la proxima actualizacion.</p>
      </div>
    </div>
  )
}
