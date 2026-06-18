export function EmptyState({ icon, titulo, mensaje, accion }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
      {icon && (
        <div className="w-16 h-16 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mb-5">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">{titulo}</h2>
      <p className="text-sm text-[#7A6555] max-w-xs">{mensaje}</p>
      {accion && <div className="mt-6">{accion}</div>}
    </div>
  )
}
