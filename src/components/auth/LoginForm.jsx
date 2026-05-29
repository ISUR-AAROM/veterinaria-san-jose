import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useReveal } from '../../hooks/useReveal'

export function LoginForm() {
  const navigate = useNavigate()
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

      const { data: personal } = await supabase
        .from('personal')
        .select('id')
        .eq('id_cuenta', authData.user.id)
        .single()

      if (personal) {
        await supabase.auth.signOut()
        setError('Usa el acceso para personal')
        setTimeout(() => setError(''), 8000)
        return
      }
      navigate('/cliente/mascotas')
    } catch {
      setError('Error inesperado. Intenta de nuevo.')
      setTimeout(() => setError(''), 8000)
    }
  }

  return (
    <section className="relative flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-[#C2570F]/[0.04] blur-3xl" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-[#4A7C59]/[0.04] blur-3xl" />

      <div ref={ref} className={`w-full max-w-sm transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#C2570F]" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.8" />
                <path d="M14 8V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M8 14H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#2C1A0E]">San Jose</h1>
            <p className="text-sm text-[#7A6555] mt-1">Inicia sesion en tu cuenta</p>
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

          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-[#7A6555]">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-[#C2570F] font-medium hover:underline">
                Registrate
              </Link>
            </p>
            <p className="text-xs">
              <Link to="/admin/login" className="text-[#7A6555] hover:text-[#C2570F] transition-colors">
                Acceso para personal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
