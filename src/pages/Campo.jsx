import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { loadSettings, saveSettings } from '../services/syncService'

function Campo() {
  const navigate = useNavigate()

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const key = 'campo-datos'

  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState([])

  // ── SUPABASE: cargar campo al montar ──────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setCargando(true)
      try {
        const data = await loadSettings()
        if (cancelled) return

        if (data?.campo?.[key]) {
          setDatos(data.campo[key])
        } else {
          setDatos(meses.map(mes => ({
            mes,
            promedio: '',
            saldo: '',
            recibi: '',
            diferencia: '',
            aclaracion: '',
            metodoPago: ''
          })))
        }
      } finally {
        if (!cancelled) setCargando(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── SUPABASE: guardar campo con debounce ──────────────────
  const saveToSupabase = useCallback(async () => {
    const settings = (await loadSettings()) || {}
    if (!settings.campo) settings.campo = {}
    settings.campo[key] = datos
    await saveSettings(settings)
  }, [datos])

  useEffect(() => {
    if (cargando) return
    const timer = setTimeout(() => { saveToSupabase() }, 2000)
    return () => clearTimeout(timer)
  }, [datos, saveToSupabase, cargando])

  const handleInputChange = (index, campo, valor) => {
    const nuevosDatos = [...datos]
    nuevosDatos[index][campo] = valor
    setDatos(nuevosDatos)
  }

  if (cargando) return <div className="text-center mt-5">Cargando...</div>

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Campo - 130 HAS</h2>

      <div className="alquiler-table-wrapper">
        <table className="table table-bordered alquiler-table-excel">
          <thead>
            <tr>
              <th className="text-center">AÑO 2026</th>
              <th className="text-center">Promedio</th>
              <th className="text-center">Saldo</th>
              <th className="text-center">Recibí</th>
              <th className="text-center">Diferencia</th>
              <th className="text-center">Aclaración</th>
              <th className="text-center">Método de Pago</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, index) => (
              <tr key={index}>
                <td className="mes-cell-excel">{fila.mes}</td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.promedio}
                    onChange={(e) => handleInputChange(index, 'promedio', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.saldo}
                    onChange={(e) => handleInputChange(index, 'saldo', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.recibi}
                    onChange={(e) => handleInputChange(index, 'recibi', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.diferencia}
                    onChange={(e) => handleInputChange(index, 'diferencia', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.aclaracion}
                    onChange={(e) => handleInputChange(index, 'aclaracion', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.metodoPago}
                    onChange={(e) => handleInputChange(index, 'metodoPago', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate('/alquileres/seleccion')}
      >
        Volver
      </button>
    </div>
  )
}

export default Campo