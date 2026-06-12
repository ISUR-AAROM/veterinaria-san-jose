import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function usePago() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const registrarPago = useCallback(async ({ id_cita, id_metodo_pago, monto, confirmado_por }) => {
    setSaving(true)
    setError(null)
    try {
      const { error: rpcError } = await supabase.rpc('registrar_pago', {
        p_id_cita: id_cita,
        p_id_metodo_pago: id_metodo_pago,
        p_monto: parseFloat(monto),
        p_confirmado_por: confirmado_por,
      })
      if (rpcError) throw rpcError
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
      .maybeSingle()
    return data
  }, [])

  return { registrarPago, getPagoDeCita, saving, error }
}
