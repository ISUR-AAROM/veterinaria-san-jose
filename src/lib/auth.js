import { supabase } from './supabase'

export async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sesión no válida. Inicia sesión nuevamente.')
  return session
}

export async function checkPersonalRole() {
  const session = await checkSession()
  const { data, error } = await supabase
    .from('personal')
    .select('rol')
    .eq('id_cuenta', session.user.id)
    .single()
  if (error || !data) throw new Error('No autorizado. Se requiere rol de personal.')
  return data
}

export async function getClienteId() {
  const session = await checkSession()
  const { data, error } = await supabase
    .from('cliente')
    .select('id')
    .eq('id_cuenta', session.user.id)
    .maybeSingle()
  if (error || !data) throw new Error('No se encontró perfil de cliente.')
  return data.id
}
