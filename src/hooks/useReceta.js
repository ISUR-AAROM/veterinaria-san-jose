import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useReceta() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const finalizarAtencion = useCallback(async ({
    id_cita,
    id_veterinario,
    diagnostico,
    observaciones,
    medicamentos,
    firmado,
    tipo_entrada = 'Consulta',
  }) => {
    setSaving(true)
    setError(null)
    try {
      const { error: rpcError } = await supabase.rpc('finalizar_atencion', {
        p_id_cita: id_cita,
        p_id_veterinario: id_veterinario,
        p_diagnostico: (diagnostico || '').trim(),
        p_observaciones: observaciones?.trim() || null,
        p_firmado: firmado ?? false,
        p_medicamentos: (medicamentos || []).map((m) => ({
          medicamento: (m.nombre || '').trim(),
          dosis: m.dosis?.trim() || null,
          indicaciones: m.indicaciones?.trim() || null,
        })),
        p_tipo_entrada: tipo_entrada,
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

  const getRecetaDeCita = useCallback(async (idCita) => {
    const { data: receta } = await supabase
      .from('receta')
      .select(`
        id, diagnostico, observaciones, firmado,
        receta_detalle ( id, medicamento, dosis, indicaciones )
      `)
      .eq('id_cita', idCita)
      .maybeSingle()
    return receta
  }, [])

  return { finalizarAtencion, getRecetaDeCita, saving, error }
}
