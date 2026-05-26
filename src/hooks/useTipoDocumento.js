import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTipoDocumento() {
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tipo_documento')
      .select('id, nombre')
      .then(({ data, error }) => {
        if (!error) setTipos(data)
        setLoading(false)
      })
  }, [])

  return { tipos, loading }
}
