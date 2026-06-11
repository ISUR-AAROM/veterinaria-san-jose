import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function usePago() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const registrarPago = useCallback(async ({ id_cita, id_metodo_pago, monto, confirmado_por }) => {
    setSaving(true)
    setError(null)
    try {
      const { error: pagoError } = await supabase
        .from('pago')
        .insert({
          id_cita,
          id_metodo_pago,
          monto: parseFloat(monto),
          confirmado_por,
        })
      if (pagoError) throw pagoError

      const { error: citaError } = await supabase
        .from('cita')
        .update({ estado: 'EN_ESPERA' })
        .eq('id', id_cita)
      if (citaError) throw citaError

      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  const getPagoDeCita = useCallback(async (idCita) => {
    const { data } = await supabase
      .from('pago')
      .select(`
        id, monto,
        metodo_pago ( id, nombre )
      `)
      .eq('id_cita', idCita)
      .single()
    return data
  }, [])

  return { registrarPago, getPagoDeCita, saving, error }
}
