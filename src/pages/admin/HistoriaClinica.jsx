export function HistoriaClinica() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C1A0E]">Historia clinica</h1>
        <p className="text-sm text-[#7A6555] mt-1">Registro medico de la mascota</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#C2570F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3H14L12 7L14 9L10 13L12 15L10 19L14 21H10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 6C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18" strokeLinecap="round" />
            <path d="M20 6C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">Proximamente</h2>
        <p className="text-sm text-[#7A6555] max-w-xs">La historia clinica completa con diagnosticos y tratamientos estara disponible en la proxima actualizacion.</p>
      </div>
    </div>
  )
}
