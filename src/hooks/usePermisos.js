import { useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'

const MAPA_PERMISOS = {
  'catalogos':          ['ADMINISTRADOR'],
  'personal.gestionar': ['ADMINISTRADOR'],
  'pago.registrar':     ['ADMINISTRADOR', 'ASISTENTE'],
  'atencion.iniciar':   ['VETERINARIO', 'ADMINISTRADOR'],
  'receta.escribir':    ['VETERINARIO', 'ADMINISTRADOR'],
  'historia.escribir':  ['VETERINARIO', 'ADMINISTRADOR'],
}

export function usePermisos() {
  const { personal } = useAdmin()
  const rol = personal?.rol ?? null

  const can = useMemo(() => {
    return (accion) => {
      if (!rol) return false
      const rolesPermitidos = MAPA_PERMISOS[accion]
      if (!rolesPermitidos) return false
      return rolesPermitidos.includes(rol)
    }
  }, [rol])

  return { rol, can }
}
