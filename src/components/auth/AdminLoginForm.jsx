import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAdmin } from '../../context/AdminContext'
import { Button, Input } from '../ui'
import { useReveal } from '../../hooks/useReveal'

export function AdminLoginForm() {
  const navigate = useNavigate()
  const { setSessionPersonal } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const ref = useReveal('animate-fade-in-up')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setTimeout(() => setError(''), 8000)
      return
    }

    const { data: personal, error: personalError } = await supabase
      .from('personal')
      .select('id, rol, nombre')
      .eq('id_cuenta', authData.user.id)
      .single()

    if (personalError || !personal) {
      await supabase.auth.signOut()
      setError('No tienes acceso como personal')
      setTimeout(() => setError(''), 8000)
      return
    }

    await setSessionPersonal(authData.user.id)
    navigate('/admin/agenda')
  }

  return (
    <section className="relative flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-10 left-1/3 w-72 h-72 rounded-full bg-[#4A7C59]/[0.04] blur-3xl" />
      <div className="absolute bottom-10 right-1/3 w-80 h-80 rounded-full bg-[#C2570F]/[0.04] blur-3xl" />

      <div ref={ref} className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#C2570F]" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 8V5C10 3.89543 10.8954 3 12 3H16C17.1046 3 18 3.89543 18 5V8" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 14H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M8 18H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#2C1A0E]">San Jose</h1>
            <p className="text-sm text-[#7A6555] mt-1">Acceso para personal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contrasena"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-xs text-[#B91C1C] text-center bg-[#B91C1C]/5 py-2 px-3 rounded-lg">{error}</p>
            )}
            <Button type="submit" className="w-full py-2.5">
              Iniciar sesion
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-[#7A6555] hover:text-[#C2570F] transition-colors">
              Acceso para clientes
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
