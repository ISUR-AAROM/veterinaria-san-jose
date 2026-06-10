import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCategoriaSala() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const cargar = async () => {
      const { data } = await supabase
        .from('categoria_sala')
        .select('id, nombre')
        .eq('is_active', true)
        .order('nombre')
      if (isMounted && data) setCategorias(data)
      if (isMounted) setLoading(false)
    }
    cargar()
    return () => { isMounted = false }
  }, [])

  return { categorias, loading }
}
