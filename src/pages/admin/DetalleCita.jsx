import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAdmin } from '../../context/AdminContext'
import { InfoCitaPanel } from '../../components/atencion/InfoCitaPanel'
import { PagoModal } from '../../components/atencion/PagoModal'
import { RecetaForm } from '../../components/atencion/RecetaForm'
import { HistoriaClinicaPanel } from '../../components/atencion/HistoriaClinicaPanel'
import { usePago } from '../../hooks/usePago'
import { useReceta } from '../../hooks/useReceta'
import { useHistoriaClinica } from '../../hooks/useHistoriaClinica'

export function DetalleCita() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personal } = useAdmin()
  const { registrarPago, getPagoDeCita, saving: savingPago, error: errorPago } = usePago()
  const { finalizarAtencion, getRecetaDeCita, saving: savingReceta, error: errorReceta } = useReceta()

  const [cita, setCita] = useState(null)
  const [pagoInfo, setPagoInfo] = useState(null)
  const [recetaInfo, setRecetaInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPagoModal, setShowPagoModal] = useState(false)
  const [mostrandoAtencion, setMostrandoAtencion] = useState(false)

  const { entradas, loading: loadingHistoria } = useHistoriaClinica(cita?.mascota?.id)

  const cargar = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('cita')
      .select(`
        id, estado, created_at,
        hueco ( id, fecha, hora_inicio, hora_fin, sala ( id, nombre ), servicio ( id, nombre ) ),
        mascota ( id, nombre ),
        cliente ( id, nombre, apellido, telefono )
      `)
      .eq('id', id)
      .single()
    setCita(data)

    const promises = []
    if (data?.estado === 'EN_ESPERA' || data?.estado === 'FINALIZADA') {
      promises.push(
        getPagoDeCita(data.id).then((pago) => { if (pago) setPagoInfo(pago) })
      )
    }
    if (data?.estado === 'FINALIZADA') {
      promises.push(
        getRecetaDeCita(data.id).then((receta) => { if (receta) setRecetaInfo(receta) })
      )
    }
    await Promise.all(promises)

    setLoading(false)
  }, [id, getPagoDeCita, getRecetaDeCita])

  useEffect(() => { cargar() }, [cargar])

  const handleRegistrarPago = () => setShowPagoModal(true)

  const handleConfirmarPago = async ({ id_metodo_pago, monto }) => {
    const ok = await registrarPago({
      id_cita: parseInt(id),
      id_metodo_pago,
      monto,
      confirmado_por: personal?.id,
    })
    if (ok) {
      setShowPagoModal(false)
      cargar()
    }
  }

  const handleIniciarAtencion = () => setMostrandoAtencion(true)

  const handleFinalizarAtencion = async ({ diagnostico, observaciones, medicamentos, firmada }) => {
    const ok = await finalizarAtencion({
      id_cita: parseInt(id),
      id_mascota: cita.mascota.id,
      diagnostico,
      observaciones,
      medicamentos,
      firmada,
    })
    if (ok) {
      setMostrandoAtencion(false)
      cargar()
    }
  }

  const handleCancelarCita = async () => {
    if (!window.confirm('¿Estás seguro? Esta acción no se puede deshacer')) return
    const { error } = await supabase
      .from('cita')
      .update({ estado: 'CANCELADA' })
      .eq('id', id)
    if (!error) {
      await supabase
        .from('hueco')
        .update({ bloqueado: false })
        .eq('id', cita.hueco?.id)
      navigate('/admin/agenda')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[#7A6555]">Cargando...</p>
      </div>
    )
  }

  if (!cita) {
    return (
      <div className="animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-14 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold text-[#2C1A0E]">Cita no encontrada</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/agenda')}
          className="text-xs text-[#7A6555] hover:text-[#C2570F] transition-colors mb-2 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 4L6 8L10 12" />
          </svg>
          Volver a agenda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <InfoCitaPanel
            cita={cita}
            pagoInfo={pagoInfo}
            onRegistrarPago={handleRegistrarPago}
            onIniciarAtencion={handleIniciarAtencion}
            onCancelarCita={handleCancelarCita}
          />

          {(mostrandoAtencion || cita.estado === 'FINALIZADA') && (
            <RecetaForm
              onFinalizar={handleFinalizarAtencion}
              saving={savingReceta}
              error={errorReceta}
            />
          )}

          {cita.estado === 'FINALIZADA' && recetaInfo && (
            <div className="bg-white border border-[#E8DDD0] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#2C1A0E] mb-3">Receta</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-[#7A6555]">Diagnóstico: </span>
                  <span className="text-sm text-[#2C1A0E]">{recetaInfo.diagnostico}</span>
                </div>
                {recetaInfo.observaciones && (
                  <div>
                    <span className="text-xs font-medium text-[#7A6555]">Observaciones: </span>
                    <span className="text-sm text-[#2C1A0E]">{recetaInfo.observaciones}</span>
                  </div>
                )}
                {recetaInfo.receta_detalle?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#7A6555] mb-1">Medicamentos:</p>
                    <div className="space-y-1.5">
                      {recetaInfo.receta_detalle.map((det) => (
                        <div key={det.id} className="bg-[#FAF7F2] rounded-lg p-2.5">
                          <p className="text-sm font-medium text-[#2C1A0E]">{det.nombre_medicamento}</p>
                          {det.dosis && <p className="text-xs text-[#7A6555]">Dosis: {det.dosis}</p>}
                          {det.indicaciones && <p className="text-xs text-[#7A6555]">Ind: {det.indicaciones}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-[#7A6555]">
                  {recetaInfo.firmada ? '✓ Firmada' : 'Sin firmar'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <HistoriaClinicaPanel entradas={entradas} loading={loadingHistoria} />
        </div>
      </div>

      <PagoModal
        open={showPagoModal}
        onClose={() => setShowPagoModal(false)}
        onConfirm={handleConfirmarPago}
        montoSugerido={cita?.servicio?.precio || cita?.hueco?.servicio?.precio || ''}
        saving={savingPago}
        error={errorPago}
      />
    </div>
  )
}
