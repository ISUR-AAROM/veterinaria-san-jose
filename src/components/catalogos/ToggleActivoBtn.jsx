import { useState } from 'react'
import { ConfirmModal } from '../ui/ConfirmModal'

export function ToggleActivoBtn({ activo, onToggle, loading, nombre = 'registro' }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = () => {
    setShowConfirm(false)
    onToggle()
  }

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-label={activo ? `Desactivar ${nombre}` : `Activar ${nombre}`}
        data-active={activo}
        className="toggle-switch"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        <span className="toggle-switch-thumb" />
      </button>
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        titulo={activo ? 'Desactivar' : 'Activar'}
        mensaje={activo ? `¿Desactivar ${nombre}?` : `¿Activar ${nombre}?`}
        confirmarTexto={activo ? 'Desactivar' : 'Activar'}
        variant={activo ? 'destructive' : 'primary'}
      />
    </>
  )
}
