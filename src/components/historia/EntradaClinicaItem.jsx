export function EntradaClinicaItem({ entrada }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="relative pl-5 pb-4 border-l-2 border-[#E8DDD0] last:pb-0 last:border-l-0">
      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#C2570F]" />
      <div className="bg-[#FAF7F2] rounded-lg p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#C2570F]">
            {entrada.tipo_entrada?.nombre || 'Consulta'}
          </span>
          <span className="text-xs text-[#7A6555]">
            {formatDate(entrada.fecha)}
          </span>
        </div>
        {entrada.diagnostico && (
          <div>
            <span className="text-xs font-medium text-[#7A6555]">Diagnóstico: </span>
            <span className="text-xs text-[#2C1A0E]">{entrada.diagnostico}</span>
          </div>
        )}
        {entrada.observaciones && (
          <div>
            <span className="text-xs font-medium text-[#7A6555]">Obs: </span>
            <span className="text-xs text-[#2C1A0E]">{entrada.observaciones}</span>
          </div>
        )}
      </div>
    </div>
  )
}
