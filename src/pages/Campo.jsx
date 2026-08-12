import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { loadCampo, saveCampo } from '../services/syncService'

function Campo() {
  const navigate = useNavigate()

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const key = 'campo-datos'

  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState([])
  const datosRef = useRef([])
  const isSaving = useRef(false)
  const pendingSave = useRef(null)

  // ── SUPABASE: cargar campo al montar ──────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setCargando(true)
      try {
        const data = await loadCampo()
        if (cancelled) return

        if (data?.[key]) {
          setDatos(data[key])
          datosRef.current = data[key]
        } else {
          const empty = meses.map(mes => ({
            mes,
            promedio: '',
            saldo: '',
            recibi: '',
            diferencia: '',
            aclaracion: '',
            metodoPago: ''
          }))
          setDatos(empty)
          datosRef.current = empty
        }
      } finally {
        if (!cancelled) setCargando(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── SUPABASE: guardar instantáneo ─────────────────────────
  async function saveCampoDatos(dataToSave) {
    pendingSave.current = dataToSave
    if (isSaving.current) return
    isSaving.current = true
    while (pendingSave.current !== null) {
      const currentData = pendingSave.current
      pendingSave.current = null
      const campoData = (await loadCampo()) || {}
      campoData[key] = currentData
      await saveCampo(campoData)
    }
    isSaving.current = false
  }

  const handleInputChange = (index, campo, valor) => {
    const nuevosDatos = datosRef.current.map((fila, i) =>
      i === index ? { ...fila, [campo]: valor } : fila
    )
    setDatos(nuevosDatos)
    datosRef.current = nuevosDatos
    saveCampoDatos(nuevosDatos)
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
                      onBlur={() => saveCampoDatos(datosRef.current)}
                      placeholder="Escribe aquí..."
                      rows="3"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control campo-textarea"
                      value={fila.saldo}
                      onChange={(e) => handleInputChange(index, 'saldo', e.target.value)}
                      onBlur={() => saveCampoDatos(datosRef.current)}
                      placeholder="Escribe aquí..."
                      rows="3"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control campo-textarea"
                      value={fila.recibi}
                      onChange={(e) => handleInputChange(index, 'recibi', e.target.value)}
                      onBlur={() => saveCampoDatos(datosRef.current)}
                      placeholder="Escribe aquí..."
                      rows="3"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control campo-textarea"
                      value={fila.diferencia}
                      onChange={(e) => handleInputChange(index, 'diferencia', e.target.value)}
                      onBlur={() => saveCampoDatos(datosRef.current)}
                      placeholder="Escribe aquí..."
                      rows="3"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control campo-textarea"
                      value={fila.aclaracion}
                      onChange={(e) => handleInputChange(index, 'aclaracion', e.target.value)}
                      onBlur={() => saveCampoDatos(datosRef.current)}
                      placeholder="Escribe aquí..."
                      rows="3"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control campo-textarea"
                      value={fila.metodoPago}
                      onChange={(e) => handleInputChange(index, 'metodoPago', e.target.value)}
                      onBlur={() => saveCampoDatos(datosRef.current)}
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