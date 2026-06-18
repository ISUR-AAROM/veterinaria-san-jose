import { useState, useCallback } from 'react'

function formatearFecha(fechaStr) {
  if (!fechaStr) return '—'
  const d = new Date(fechaStr + (fechaStr.includes('T') ? '' : 'T00:00:00'))
  return d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildRecetaHtml({ cita, recetaInfo, personal }) {
  const cliente = cita.cliente
  const mascota = cita.mascota
  const servicio = cita.hueco?.servicio
  const fechaEmision = formatearFecha(cita.hueco?.fecha)
  const medicamentos = recetaInfo.receta_detalle || []

  return `
    <div style="font-family:Inter,Helvetica,Arial,sans-serif;color:#2C1A0E;padding:32px 40px;max-width:640px;margin:0 auto;">
      <div style="text-align:center;border-bottom:2px solid #C2570F;padding-bottom:12px;margin-bottom:24px;">
        <h1 style="font-size:20px;font-weight:700;color:#C2570F;margin:0;letter-spacing:1px;">VETERINARIA SAN JOSÉ</h1>
        <p style="font-size:11px;color:#7A6555;margin:4px 0 0;">Av. Principal 123 · (01) 555-1234 · Lun-Sáb 9:00-18:00</p>
      </div>

      <h2 style="font-size:15px;font-weight:700;text-align:center;margin:0 0 20px;letter-spacing:2px;text-transform:uppercase;color:#2C1A0E;">Receta Médica</h2>

      <div style="display:flex;justify-content:space-between;font-size:11px;color:#7A6555;margin-bottom:14px;">
        <span>Fecha: <strong style="color:#2C1A0E;">${fechaEmision}</strong></span>
        <span>N°: <strong style="color:#2C1A0E;font-family:monospace;">${(cita.id || '').slice(0, 8).toUpperCase()}</strong></span>
      </div>

      <div style="font-size:11px;margin-bottom:16px;">
        <span style="color:#7A6555;">Veterinario: </span>
        <strong style="color:#2C1A0E;">Dr. ${(personal?.nombre || '').trim() || '—'}</strong>
      </div>

      <div style="background:#FAF7F2;border-radius:8px;padding:12px 14px;margin-bottom:16px;">
        <p style="font-size:10px;font-weight:600;color:#7A6555;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Paciente</p>
        <table style="width:100%;font-size:11px;border-collapse:collapse;">
          <tr><td style="color:#7A6555;width:100px;padding:3px 0;vertical-align:top;">Mascota:</td><td style="color:#2C1A0E;font-weight:500;padding:3px 0;">${mascota?.nombre || '—'}</td></tr>
          <tr><td style="color:#7A6555;padding:3px 0;vertical-align:top;">Especie:</td><td style="color:#2C1A0E;padding:3px 0;">${mascota?.especie_mascota?.nombre || '—'}</td></tr>
          <tr><td style="color:#7A6555;padding:3px 0;vertical-align:top;">Servicio:</td><td style="color:#2C1A0E;padding:3px 0;">${servicio?.nombre || '—'}</td></tr>
          <tr><td style="color:#7A6555;padding:3px 0;vertical-align:top;">Propietario:</td><td style="color:#2C1A0E;font-weight:500;padding:3px 0;">${(cliente?.nombre || '') + ' ' + (cliente?.apellido || '')}</td></tr>
          <tr><td style="color:#7A6555;padding:3px 0;vertical-align:top;">Teléfono:</td><td style="color:#2C1A0E;padding:3px 0;">${cliente?.telefono || '—'}</td></tr>
        </table>
      </div>

      <div style="margin-bottom:16px;">
        <p style="font-size:10px;font-weight:600;color:#7A6555;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Diagnóstico</p>
        <p style="font-size:12px;color:#2C1A0E;margin:0;line-height:1.5;white-space:pre-wrap;">${recetaInfo.diagnostico || '—'}</p>
      </div>

      ${medicamentos.length > 0 ? `
      <div style="margin-bottom:16px;">
        <p style="font-size:10px;font-weight:600;color:#7A6555;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Medicamentos recetados</p>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="background:#FAF7F2;">
              <th style="text-align:left;padding:6px 8px;color:#7A6555;font-weight:600;border:1px solid #E8DDD0;width:40%;">Medicamento</th>
              <th style="text-align:left;padding:6px 8px;color:#7A6555;font-weight:600;border:1px solid #E8DDD0;width:25%;">Dosis</th>
              <th style="text-align:left;padding:6px 8px;color:#7A6555;font-weight:600;border:1px solid #E8DDD0;">Indicaciones</th>
            </tr>
          </thead>
          <tbody>
            ${medicamentos.map((m) => `
            <tr>
              <td style="padding:6px 8px;border:1px solid #E8DDD0;color:#2C1A0E;font-weight:500;">${m.medicamento}</td>
              <td style="padding:6px 8px;border:1px solid #E8DDD0;color:#2C1A0E;">${m.dosis || '—'}</td>
              <td style="padding:6px 8px;border:1px solid #E8DDD0;color:#2C1A0E;">${m.indicaciones || '—'}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${recetaInfo.observaciones ? `
      <div style="margin-bottom:16px;">
        <p style="font-size:10px;font-weight:600;color:#7A6555;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Observaciones</p>
        <p style="font-size:12px;color:#2C1A0E;margin:0;line-height:1.5;white-space:pre-wrap;">${recetaInfo.observaciones}</p>
      </div>
      ` : ''}

      <div style="margin-top:28px;padding-top:16px;border-top:1px solid #E8DDD0;">
        <p style="font-size:12px;color:#2C1A0E;font-weight:500;margin:0 0 2px;">
          ${recetaInfo.firmado ? '✓ Receta firmada digitalmente' : 'Receta sin firma digital'}
        </p>
        <p style="font-size:12px;color:#2C1A0E;font-weight:500;margin:0 0 24px;">
          Dr. ${(personal?.nombre || '').trim() || '—'}
        </p>
        <div style="border-bottom:1px solid #2C1A0E;width:220px;"></div>
        <p style="font-size:10px;color:#7A6555;margin:3px 0 0;">Firma del médico veterinario</p>
      </div>

      <div style="margin-top:20px;padding-top:12px;border-top:1px solid #E8DDD0;text-align:center;">
        <p style="font-size:9px;color:#7A6555;margin:0;font-style:italic;">* Receta válida por 30 días calendario *</p>
        <p style="font-size:9px;color:#7A6555;margin:3px 0 0;">Veterinaria San José — Av. Principal 123 — (01) 555-1234</p>
      </div>
    </div>
  `
}

export function useGenerarPdfReceta() {
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState(null)

  const generarPdf = useCallback(async ({ cita, recetaInfo, personal }) => {
    setGenerando(true)
    setError(null)
    let container = null
    try {
      if (!recetaInfo) throw new Error('No hay receta asociada a esta cita')

      container = document.createElement('div')
      container.style.cssText =
        'position:fixed;left:-9999px;top:0;width:640px;background:white;z-index:-1;'
      container.innerHTML = buildRecetaHtml({ cita, recetaInfo, personal })
      document.body.appendChild(container)

      await Promise.all(
        Array.from(container.querySelectorAll('img')).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve()
              img.onload = resolve
              img.onerror = resolve
            })
        )
      )

      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas.default(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (doc) => {
          doc.body.style.margin = '0'
        },
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margins = 15
      const usableWidth = pageWidth - margins * 2
      const usableHeight = pageHeight - margins * 2

      const imgRatio = canvas.height / canvas.width
      const imgWidth = usableWidth
      const imgHeight = imgWidth * imgRatio

      let yOffset = 0
      let page = 0

      while (yOffset < imgHeight) {
        if (page > 0) pdf.addPage()
        pdf.addImage(
          imgData, 'PNG',
          margins, margins - yOffset,
          imgWidth, imgHeight
        )
        yOffset += usableHeight
        page++
      }

      pdf.save(`receta_${(cita.id || '').slice(0, 8)}.pdf`)
    } catch (err) {
      setError(err.message || 'Error al generar el PDF')
    } finally {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      setGenerando(false)
    }
  }, [])

  return { generarPdf, generando, error }
}
