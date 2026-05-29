import { Button } from '../ui/Button'

export function CatalogoLayout({ titulo, descripcion, onAgregar, children, botonTexto = 'Agregar', total }) {

  return (
    <div className="animate-fade-in-up">
      <div className="relative mb-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#2C1A0E] to-[#4A3520] px-8 py-7 shadow-lg">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.04]">
          <svg viewBox="0 0 200 200" className="h-full w-full" fill="white">
            <circle cx="50" cy="50" r="60" />
            <circle cx="150" cy="120" r="80" />
            <circle cx="80" cy="180" r="40" />
          </svg>
        </div>
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl leading-tight text-white">{titulo}</h1>
            {descripcion && (
              <p className="text-sm text-white/70">{descripcion}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {total !== undefined && (
              <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 sm:flex">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                {total} registro{total !== 1 ? 's' : ''}
              </span>
            )}
            <Button
              onClick={onAgregar}
              className="!bg-white !text-[#2C1A0E] hover:!bg-white/90 !shadow-sm !font-semibold !text-sm"
            >
              + {botonTexto}
            </Button>
          </div>
        </div>
      </div>

      <div className="animate-slide-up">
        {children}
      </div>
    </div>
  )
}
