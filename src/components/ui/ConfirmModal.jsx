import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmModal({ open, onClose, onConfirm, titulo, mensaje, confirmarTexto = 'Confirmar', variant = 'primary' }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#2C1A0E] mb-2">{titulo}</h3>
        <p className="text-sm text-[#7A6555] mb-6">{mensaje}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmarTexto}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
