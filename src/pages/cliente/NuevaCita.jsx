import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServicios } from '../../hooks/useServicios'
import { useMascotas } from '../../hooks/useMascotas'
import { useHuecosDisponibles } from '../../hooks/useHuecosDisponibles'
import { getClienteId } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { ServicioSelector } from '../../components/citas/ServicioSelector'
import { HuecoPicker } from '../../components/citas/HuecoPicker'
import { ResumenCita } from '../../components/citas/ResumenCita'

function getLocalDateString(date) {
  const d = date || new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const STEPS = [
  { num: 1, label: 'Mascota y servicio' },
  { num: 2, label: 'Elegir horario' },
  { num: 3, label: 'Confirmar' },
]

export function NuevaCita() {
  const navigate = useNavigate()

  const [idCliente, setIdCliente] = useState(null)
  const [clienteLoading, setClienteLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [idMascota, setIdMascota] = useState('')
  const [idServicio, setIdServicio] = useState('')
  const [fecha, setFecha] = useState(() => getLocalDateString())
  const [huecoSeleccionado, setHuecoSeleccionado] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [error, setError] = useState(null)

  useEffect(() => {
    getClienteId()
      .then(setIdCliente)
      .finally(() => setClienteLoading(false))
  }, [])

  const { mascotas, loading: loadingMascotas } = useMascotas(idCliente)
  const { servicios } = useServicios()
  const { huecos, agrupadosPorFecha, loading: loadingHuecos } = useHuecosDisponibles(idServicio, fecha)

  const mascotasActivas = useMemo(
    () => mascotas.filter((m) => m.is_active),
    [mascotas]
  )

  const mascotaOptions = useMemo(
    () => mascotasActivas.map((m) => ({ value: m.id, label: m.nombre })),
    [mascotasActivas]
  )

  const servicioSeleccionado = useMemo(
    () => servicios.find((s) => s.id === idServicio),
    [servicios, idServicio]
  )

  const mascotaSeleccionada = useMemo(
    () => mascotasActivas.find((m) => m.id === idMascota),
    [mascotasActivas, idMascota]
  )

  const canNextStep1 = idMascota && idServicio
  const canNextStep2 = !!huecoSeleccionado

  useEffect(() => {
    if (!success) return
    if (countdown <= 0) {
      navigate('/cliente/citas')
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [success, countdown, navigate])

  const handleConfirmar = useCallback(async () => {
    setConfirmando(true)
    setError(null)
    const { error } = await supabase.rpc('reservar_cita', {
      p_id_cliente: idCliente,
      p_id_mascota: idMascota,
      p_id_hueco: huecoSeleccionado.id,
    })
    setConfirmando(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }, [idCliente, idMascota, huecoSeleccionado])

  if (clienteLoading) {
    return (
      <div className="animate-fade-in-up">
        <Header />
        <div className="flex items-center justify-center py-20 text-sm text-[#7A6555]">
          Cargando...
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="animate-fade-in-up">
        <Header />
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-[#166534]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17L4 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#2C1A0E] mb-1">¡Cita reservada con éxito!</h2>
          <p className="text-sm text-[#7A6555] max-w-xs">
            Serás redirigido a tus citas en {countdown} segundo{countdown !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto">
      <Header />

      <StepperHeader currentStep={step} />

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#2C1A0E] mb-3">Selecciona tu mascota</h3>
            {loadingMascotas ? (
              <p className="text-sm text-[#7A6555]">Cargando mascotas...</p>
            ) : mascotaOptions.length === 0 ? (
              <p className="text-sm text-[#7A6555]">
                No tienes mascotas registradas. Primero registra una.
              </p>
            ) : (
              <Select
                placeholder="Seleccionar mascota"
                options={mascotaOptions}
                value={idMascota}
                onChange={(e) => setIdMascota(e.target.value)}
              />
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#2C1A0E] mb-3">Selecciona un servicio</h3>
            {servicios.length === 0 ? (
              <p className="text-sm text-[#7A6555]">Cargando servicios...</p>
            ) : (
              <ServicioSelector
                servicios={servicios}
                selected={idServicio}
                onSelect={setIdServicio}
              />
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)} disabled={!canNextStep1}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#2C1A0E] mb-3">Elige un horario disponible</h3>

            <div className="flex items-end gap-3 mb-6">
              <div className="flex-1">
                <Input
                  label="Fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => { setFecha(e.target.value); setHuecoSeleccionado(null) }}
                  min={getLocalDateString()}
                />
              </div>
              <Button
                variant="secondary"
                className="text-xs px-3 py-2"
                onClick={() => { setFecha(getLocalDateString()); setHuecoSeleccionado(null) }}
              >
                Hoy
              </Button>
              <Button
                variant="secondary"
                className="text-xs px-3 py-2"
                onClick={() => { setFecha(getLocalDateString(addDays(new Date(), 1))); setHuecoSeleccionado(null) }}
              >
                Mañana
              </Button>
              <Button
                variant="secondary"
                className="text-xs px-3 py-2"
                onClick={() => { setFecha(getLocalDateString(addDays(new Date(), 3))); setHuecoSeleccionado(null) }}
              >
                +3 días
              </Button>
            </div>

            {loadingHuecos ? (
              <p className="text-sm text-[#7A6555]">Cargando horarios...</p>
            ) : huecos.length === 0 ? (
              <p className="text-sm text-[#7A6555]">
                No hay horarios disponibles para este servicio en la fecha seleccionada.
                Prueba con otro día o servicio.
              </p>
            ) : (
              <HuecoPicker
                agrupadosPorFecha={agrupadosPorFecha}
                selected={huecoSeleccionado?.id}
                onSelect={setHuecoSeleccionado}
              />
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="secondary" onClick={() => { setStep(1); setHuecoSeleccionado(null) }}>
              Atrás
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canNextStep2}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <ResumenCita
            mascota={mascotaSeleccionada}
            servicio={servicioSeleccionado}
            hueco={huecoSeleccionado}
            onConfirm={handleConfirmar}
            loading={confirmando}
          />

          {error && (
            <p className="text-xs text-[#B91C1C] text-center">{error}</p>
          )}

          <div className="flex justify-start">
            <Button variant="secondary" onClick={() => { setStep(2) }}>
              Atrás
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-[#2C1A0E]">Reservar cita</h1>
      <p className="text-sm text-[#7A6555] mt-1">Agenda una consulta para tu mascota</p>
    </div>
  )
}

function StepperHeader({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              currentStep >= step.num
                ? 'bg-[#C2570F] text-white shadow-sm shadow-[#C2570F]/20'
                : 'bg-[#E8DDD0] text-[#7A6555]'
            }`}
          >
            {currentStep > step.num ? (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.333 4L6 11.333L2.667 8" />
              </svg>
            ) : (
              step.num
            )}
          </div>
          <span
            className={`text-sm transition-colors duration-300 ${
              currentStep >= step.num ? 'text-[#2C1A0E] font-medium' : 'text-[#7A6555]'
            }`}
          >
            {step.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`w-14 h-0.5 rounded transition-colors duration-300 ${
                currentStep > step.num ? 'bg-[#C2570F]' : 'bg-[#E8DDD0]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
