import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { StepperHeader, FormCliente, FormMascota } from '../registro'
import { useReveal } from '../../hooks/useReveal'

const clienteVacio = {
  id_tipo_documento: '',
  numero_documento: '',
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  password: '',
  confirmarPassword: '',
}

const mascotaVacia = {
  nombre: '',
  id_especie: '',
  id_raza: '',
  fecha_nacimiento: '',
}

function validarCliente(d) {
  const e = {}
  if (!d.id_tipo_documento) e.id_tipo_documento = 'Selecciona un tipo de documento'
  if (!d.numero_documento.trim()) e.numero_documento = 'Campo obligatorio'
  if (!d.nombre.trim()) e.nombre = 'Campo obligatorio'
  if (!d.apellido.trim()) e.apellido = 'Campo obligatorio'
  if (!/^\d{9}$/.test(d.telefono)) e.telefono = 'Debe tener 9 digitos'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Email invalido'
  if (d.password.length < 6) e.password = 'Minimo 6 caracteres'
  if (d.password !== d.confirmarPassword) e.confirmarPassword = 'Las contrasenas no coinciden'
  return e
}

function validarMascota(d) {
  const e = {}
  if (!d.nombre.trim()) e.nombre = 'Campo obligatorio'
  if (!d.id_especie) e.id_especie = 'Selecciona una especie'
  if (!d.fecha_nacimiento) e.fecha_nacimiento = 'Campo obligatorio'
  return e
}

export function RegistroForm() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [cliente, setCliente] = useState(clienteVacio)
  const [mascota, setMascota] = useState(mascotaVacia)
  const [errors, setErrors] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const ref = useReveal('animate-fade-in-up')

  const handleSiguiente = (e) => {
    e.preventDefault()
    const e2 = validarCliente(cliente)
    setErrors(e2)
    if (Object.keys(e2).length === 0) setPaso(2)
  }

  const handleFinalizar = async (e) => {
    e.preventDefault()
    const e2 = validarMascota(mascota)
    setErrors(e2)
    if (Object.keys(e2).length > 0) return

    setErrorGeneral('')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cliente.email,
      password: cliente.password,
    })
    if (authError) {
      setErrorGeneral(authError.message)
      setTimeout(() => setErrorGeneral(''), 8000)
      return
    }

    const idCuenta = authData.user.id

    const { error: cuentaError } = await supabase.from('cuenta').insert({
      id: idCuenta,
      email: cliente.email,
    })
    if (cuentaError) {
      setErrorGeneral('Error al crear la cuenta')
      return
    }

    const { data: clienteData, error: clienteError } = await supabase
      .from('cliente')
      .insert({
        id_cuenta: idCuenta,
        id_tipo_documento: Number(cliente.id_tipo_documento),
        numero_documento: cliente.numero_documento,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
      })
      .select('id')
      .single()
    if (clienteError) {
      setErrorGeneral('Error al registrar el cliente')
      return
    }

    const { error: mascotaError } = await supabase.from('mascota').insert({
      id_cliente: clienteData.id,
      nombre: mascota.nombre,
      id_especie: Number(mascota.id_especie),
      id_raza: mascota.id_raza ? Number(mascota.id_raza) : null,
      fecha_nacimiento: mascota.fecha_nacimiento,
    })
    if (mascotaError) {
      setErrorGeneral('Error al registrar la mascota')
      return
    }

    navigate('/cliente/mascotas')
  }

  return (
    <section className="relative flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-[#C2570F]/[0.04] blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#4A7C59]/[0.04] blur-3xl" />

      <div ref={ref} className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#FFF3EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#C2570F]" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.8" />
                <path d="M14 8V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M8 14H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#2C1A0E]">Crear cuenta</h1>
            <p className="text-sm text-[#7A6555] mt-1">Registrate y agrega a tu mascota</p>
          </div>

          <StepperHeader currentStep={paso} />

          {errorGeneral && (
            <p className="text-xs text-[#B91C1C] text-center bg-[#B91C1C]/5 py-2 px-3 rounded-lg mb-4">{errorGeneral}</p>
          )}

          {paso === 1 ? (
            <FormCliente
              data={cliente}
              onChange={setCliente}
              onSubmit={handleSiguiente}
              errors={errors}
            />
          ) : (
            <FormMascota
              data={mascota}
              onChange={setMascota}
              onSubmit={handleFinalizar}
              errors={errors}
            />
          )}
        </div>
      </div>
    </section>
  )
}
