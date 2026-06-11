import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useReceta() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const finalizarAtencion = useCallback(async ({
    id_cita,
    id_mascota,
    diagnostico,
    observaciones,
    medicamentos,
    firmada,
    id_tipo_entrada = 1,
  }) => {
    setSaving(true)
    setError(null)
    try {
      const { data: receta, error: recetaError } = await supabase
        .from('receta')
        .insert({
          id_cita,
          diagnostico: diagnostico.trim(),
          observaciones: observaciones?.trim() || null,
          firmada,
        })
        .select('id')
        .single()
      if (recetaError) throw recetaError

      if (medicamentos.length > 0) {
        const { error: detalleError } = await supabase
          .from('receta_detalle')
          .insert(
            medicamentos.map((m) => ({
              id_receta: receta.id,
              nombre_medicamento: m.nombre.trim(),
              dosis: m.dosis?.trim() || null,
              indicaciones: m.indicaciones?.trim() || null,
            }))
          )
        if (detalleError) throw detalleError
      }

      const { data: hc } = await supabase
        .from('historia_clinica')
        .select('id')
        .eq('id_mascota', id_mascota)
        .single()

      if (hc) {
        const { error: entradaError } = await supabase
          .from('entrada_historia_clinica')
          .insert({
            id_historia_clinica: hc.id,
            id_tipo_entrada,
            diagnostico: diagnostico.trim(),
            observaciones: observaciones?.trim() || null,
          })
        if (entradaError) throw entradaError
      }

      const { error: citaError } = await supabase
        .from('cita')
        .update({ estado: 'FINALIZADA' })
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

  const getRecetaDeCita = useCallback(async (idCita) => {
    const { data: receta } = await supabase
      .from('receta')
      .select(`
        id, diagnostico, observaciones, firmada, created_at,
        receta_detalle ( id, nombre_medicamento, dosis, indicaciones )
      `)
      .eq('id_cita', idCita)
      .single()
    return receta
  }, [])

  return { finalizarAtencion, getRecetaDeCita, saving, error }
}
