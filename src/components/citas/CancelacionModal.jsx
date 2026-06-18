import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'

export function CancelacionModal({ open, onClose, idCita, onConfirmada }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    let isMounted = true
    const { error } = await supabase.rpc('cancelar_cita', { p_id_cita: idCita })
    if (!isMounted) return
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      onConfirmada?.()
      onClose()
    }
    return () => { isMounted = false }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#2C1A0E] mb-2">Cancelar cita</h3>
        <p className="text-sm text-[#7A6555] mb-6">
          ¿Estás seguro? Esta acción no se puede deshacer.
        </p>
        {error && (
          <p className="text-xs text-[#B91C1C] mb-4">{error}</p>
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Cancelando...' : 'Sí, cancelar cita'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
