import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTipoDocumento() {
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadTipos = async () => {
      const { data, error } = await supabase
        .from('tipo_documento')
        .select('id, nombre')

      if (!isMounted) return
      if (!error) setTipos(data)
      setLoading(false)
    }

    loadTipos()

    return () => {
      isMounted = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — solo al montar

  return { tipos, loading }
}
