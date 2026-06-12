const variants = {
  primary:
    'bg-[#C2570F] text-white hover:bg-[#A8480C]',
  secondary:
    'border border-[#E8DDD0] text-[#2C1A0E] hover:bg-[#FAF7F2]',
  destructive:
    'bg-[#B91C1C] text-white hover:bg-[#991B1B]',
}

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const variantClass = variants[variant] || variants.primary
  return (
    <button
      className={`font-medium text-sm px-4 py-2 rounded-lg transition-colors ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
