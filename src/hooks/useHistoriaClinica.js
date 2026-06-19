import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useHistoriaClinica(idMascota) {
  const [entradas, setEntradas] = useState([])
  const [recetasMap, setRecetasMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    if (!idMascota) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data: hc } = await supabase
      .from('historia_clinica')
      .select('id')
      .eq('id_mascota', idMascota)
      .maybeSingle()

    if (!hc) {
      setLoading(false)
      setEntradas([])
      setRecetasMap({})
      return
    }

    const { data, error } = await supabase
      .from('entrada_historia_clinica')
      .select(`
        id, diagnostico, observaciones, fecha, version, id_cita,
        tipo_entrada ( id, nombre )
      `)
      .eq('id_historia_clinica', hc.id)
      .order('version', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false })

    if (error) {
      setError(error.message)
      setEntradas([])
      setRecetasMap({})
    } else {
      setEntradas(data || [])

      const idsCita = [...new Set((data || []).map(e => e.id_cita).filter(Boolean))]
      if (idsCita.length > 0) {
        const { data: recetas } = await supabase
          .from('receta')
          .select(`
            id, id_cita, diagnostico, observaciones, firmado,
            personal ( id, nombre ),
            receta_detalle ( id, medicamento, dosis, indicaciones )
          `)
          .in('id_cita', idsCita)
        const map = {}
        ;(recetas || []).forEach(r => { map[r.id_cita] = r })
        setRecetasMap(map)
      } else {
        setRecetasMap({})
      }
    }
    setLoading(false)
  }, [idMascota])

  useEffect(() => { cargar() }, [cargar])

  return { entradas, recetasMap, loading, error, recargar: cargar }
}
