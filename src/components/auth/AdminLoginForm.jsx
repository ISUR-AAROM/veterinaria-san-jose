import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAdmin } from '../../context/AdminContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useReveal } from '../../hooks/useReveal'
import logoSrc from '../../assets/logo.png'

export function AdminLoginForm() {
  const navigate = useNavigate()
  const { setSessionPersonal } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { ref, isVisible } = useReveal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
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
    } catch {
      setError('Error inesperado. Intenta de nuevo.')
      setTimeout(() => setError(''), 8000)
    }
  }

  return (
    <section className="relative flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-10 left-1/3 w-72 h-72 rounded-full bg-[#4A7C59]/[0.04] blur-3xl" />
      <div className="absolute bottom-10 right-1/3 w-80 h-80 rounded-full bg-[#C2570F]/[0.04] blur-3xl" />

      <div ref={ref} className={`w-full max-w-sm transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logoSrc} alt="San Jose" className="h-20 w-auto" />
            </div>
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
              Iniciar sesión
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
