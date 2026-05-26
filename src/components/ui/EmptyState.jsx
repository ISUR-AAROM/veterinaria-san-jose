export function EmptyState({ message = 'Sin datos disponibles' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">📭</span>
      <p className="text-sm text-[#7A6555]">{message}</p>
    </div>
  )
}
