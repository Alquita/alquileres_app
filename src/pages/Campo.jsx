import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import MigrateButton from '../components/MigrateButton'
import { loadSettings, saveSettings } from '../services/syncService'

function Campo() {
  const navigate = useNavigate()

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  const storageKey = 'campo-datos'

  // Cargar datos guardados o inicializar
  const [datos, setDatos] = useState(() => {
    const datosGuardados = localStorage.getItem(storageKey)
    if (datosGuardados) {
      return JSON.parse(datosGuardados)
    }
    return meses.map(mes => ({
      mes,
      promedio: '',
      saldo: '',
      recibi: '',
      diferencia: '',
      aclaracion: ''
    }))
  })

  // Guardar en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(datos))
  }, [datos])

  // ── SUPABASE: cargar campo desde la nube al montar ───────
  useEffect(() => {
    let cancelled = false
    async function loadFromSupabase() {
      const data = await loadSettings()
      if (cancelled || !data?.campo?.[storageKey]) return

      setDatos(data.campo[storageKey])
    }
    loadFromSupabase()
    return () => { cancelled = true }
  }, [])

  // ── SUPABASE: guardar campo con debounce ─────────────────
  const saveToSupabase = useCallback(async () => {
    const settings = (await loadSettings()) || {}
    if (!settings.campo) settings.campo = {}
    settings.campo[storageKey] = datos
    await saveSettings(settings)
  }, [datos])

  useEffect(() => {
    const timer = setTimeout(() => { saveToSupabase() }, 2000)
    return () => clearTimeout(timer)
  }, [datos, saveToSupabase])

  const handleMigrate = async () => {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return false

    const settings = (await loadSettings()) || {}
    if (!settings.campo) settings.campo = {}
    settings.campo[storageKey] = JSON.parse(saved)
    return await saveSettings(settings)
  }

  const handleInputChange = (index, campo, valor) => {
    const nuevosDatos = [...datos]
    nuevosDatos[index][campo] = valor
    setDatos(nuevosDatos)
  }

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
                    rows="2"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.saldo}
                    onChange={(e) => handleInputChange(index, 'saldo', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="2"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.recibi}
                    onChange={(e) => handleInputChange(index, 'recibi', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="2"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.diferencia}
                    onChange={(e) => handleInputChange(index, 'diferencia', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="2"
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.aclaracion}
                    onChange={(e) => handleInputChange(index, 'aclaracion', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/alquileres/seleccion')}
        >
          Volver
        </button>
        <MigrateButton onMigrate={handleMigrate} label="Subir campo" />
      </div>
    </div>
  )
}

export default Campo