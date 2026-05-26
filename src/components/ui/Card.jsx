export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-[#E8DDD0] rounded-lg p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
