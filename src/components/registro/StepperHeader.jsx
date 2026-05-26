const steps = [
  { num: 1, label: 'Datos del cliente' },
  { num: 2, label: 'Primera mascota' },
]

export function StepperHeader({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              currentStep >= step.num
                ? 'bg-[#C2570F] text-white shadow-sm shadow-[#C2570F]/20'
                : 'bg-[#E8DDD0] text-[#7A6555]'
            }`}
          >
            {currentStep > step.num ? (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.333 4L6 11.333L2.667 8" />
              </svg>
            ) : (
              step.num
            )}
          </div>
          <span
            className={`text-sm transition-colors duration-300 ${
              currentStep >= step.num ? 'text-[#2C1A0E] font-medium' : 'text-[#7A6555]'
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-14 h-0.5 rounded transition-colors duration-300 ${
                currentStep > step.num ? 'bg-[#C2570F]' : 'bg-[#E8DDD0]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
