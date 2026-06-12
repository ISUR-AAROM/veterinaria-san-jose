import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { useMetodoPago } from '../../hooks/useMetodoPago'

export function PagoModal({ open, onClose, onConfirm, montoSugerido, saving, error }) {
  const { metodos, loading: loadingMetodos } = useMetodoPago()
  const [idMetodoPago, setIdMetodoPago] = useState('')
  const [monto, setMonto] = useState(montoSugerido || '')
  const [errors, setErrors] = useState({})

  const handleConfirm = async () => {
    const e = {}
    if (!idMetodoPago) e.metodo = 'Selecciona un método de pago'
    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) e.monto = 'Ingresa un monto válido'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    if (typeof onConfirm !== 'function') return
    await onConfirm({ id_metodo_pago: idMetodoPago, monto: parseFloat(monto) })
  }

  const handleClose = () => {
    setIdMetodoPago('')
    setMonto(montoSugerido || '')
    setErrors({})
    if (typeof onClose === 'function') onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#FFF3EB] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-[#C2570F]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="16" height="12" rx="2" />
              <circle cx="10" cy="10" r="2.5" />
              <path d="M4 7H8M12 7H16" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2C1A0E]">Registrar pago</h2>
            <p className="text-xs text-[#7A6555]">Confirma el pago para iniciar la atención</p>
          </div>
        </div>

        {!loadingMetodos && (metodos || []).length > 0 && (
          <Select
            label="Método de pago"
            placeholder="Seleccionar método"
            options={(metodos || []).map((m) => ({ value: m.id, label: m.nombre }))}
            value={idMetodoPago}
            onChange={(e) => setIdMetodoPago(e.target.value)}
            error={errors.metodo}
          />
        )}

        <div className="mt-4">
          <Input
            label="Monto (S/)"
            type="number"
            min="0"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            error={errors.monto}
            placeholder="0.00"
          />
        </div>

        {error && (
          <p className="text-xs text-[#B91C1C] mt-3">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={saving} className="flex-1">
            {saving ? 'Registrando...' : 'Confirmar pago'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
