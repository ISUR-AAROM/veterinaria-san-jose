import { Button } from '../ui/Button'

export function CatalogoModal({ open, onClose, titulo, onGuardar, cargando, children, botonTexto = 'Guardar' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-scale-in relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="h-1.5 bg-gradient-to-r from-[#C2570F] to-[#E89248]" />
          <div className="p-6">
            <h2 className="font-display text-xl leading-tight text-[#2C1A0E] mb-5">{titulo}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onGuardar()
              }}
              className="space-y-4"
            >
              {children}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={cargando}>
                  {cargando ? 'Guardando...' : botonTexto}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
