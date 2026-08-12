import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { loadCampo, saveCampo } from '../services/syncService'

function Campo() {
  const navigate = useNavigate()

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const key = 'campo-datos'
  const key40 = 'campo-40has-datos'

  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)
  const [data, setData] = useState(() => crearVacio())
  const dataRef = useRef(data)
  const colaGuardado = useRef(Promise.resolve())
  const dirtyRef = useRef(false)

  function crearVacio() {
    return {
      [key]: meses.map(mes => ({
        mes,
        promedio: '',
        saldo: '',
        recibi: '',
        diferencia: '',
        aclaracion: '',
        metodoPago: ''
      })),
      [key40]: Array.from({ length: 8 }, () => ({
        pagos: '',
        valorUsdHa: '',
        valor: '',
        condicion: ''
      }))
    }
  }

  // ── SUPABASE: cargar campo al montar ──────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setCargando(true)
      try {
        const dbData = await loadCampo()
        if (cancelled) return

        const inicial = crearVacio()
        if (dbData) {
          if (Array.isArray(dbData[key])) inicial[key] = dbData[key]
          if (Array.isArray(dbData[key40])) inicial[key40] = dbData[key40]
        }
        dataRef.current = inicial
        setData(inicial)
        setErrorCarga(false)
      } catch {
        if (!cancelled) {
          setErrorCarga(true)
          toast.error('No se pudieron cargar los datos de la base. Comprobá tu conexión y recargá.')
        }
      } finally {
        if (!cancelled) setCargando(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── SUPABASE: guardado único serializado con reintento ────
  function guardarAhora() {
    const snapshot = JSON.parse(JSON.stringify(dataRef.current))
    dirtyRef.current = false
    colaGuardado.current = colaGuardado.current.then(async () => {
      let ok = false
      for (let i = 0; i < 3 && !ok; i++) {
        ok = await saveCampo(snapshot)
        if (!ok) await new Promise(r => setTimeout(r, 1000))
      }
      if (!ok) {
        dirtyRef.current = true
        toast.error('No se pudo guardar. Reintentá en un momento.')
      }
    })
  }

  const handleInputChange = (llave, index, campo, valor) => {
    const nuevo = {
      ...dataRef.current,
      [llave]: dataRef.current[llave].map((fila, i) =>
        i === index ? { ...fila, [campo]: valor } : fila
      )
    }
    dataRef.current = nuevo
    setData(nuevo)
    dirtyRef.current = true
    guardarAhora()
  }

  // ── Guardar lo pendiente al cerrar la página ───────────────
  useEffect(() => {
    function flush() {
      if (dirtyRef.current) guardarAhora()
    }
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
    }
  }, [])

  if (cargando) return <div className="text-center mt-5">Cargando...</div>

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Campo - 130 HAS</h2>

      {errorCarga && (
        <div className="alert alert-warning mt-3">
          No se pudieron cargar los datos de la base. Los campos están bloqueados para no borrar
          nada. Comprobá tu conexión y recargá la página.
        </div>
      )}

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
            {data[key].map((fila, index) => (
              <tr key={index}>
                <td className="mes-cell-excel">{fila.mes}</td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.promedio}
                    onChange={(e) => handleInputChange(key, index, 'promedio', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.saldo}
                    onChange={(e) => handleInputChange(key, index, 'saldo', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.recibi}
                    onChange={(e) => handleInputChange(key, index, 'recibi', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.diferencia}
                    onChange={(e) => handleInputChange(key, index, 'diferencia', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.aclaracion}
                    onChange={(e) => handleInputChange(key, index, 'aclaracion', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.metodoPago}
                    onChange={(e) => handleInputChange(key, index, 'metodoPago', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="alquiler-page-title" style={{ marginTop: '3rem' }}>40 has (pro-de-man)</h2>

      <div className="alquiler-table-wrapper">
        <table className="table table-bordered alquiler-table-excel">
          <thead>
            <tr>
              <th className="text-center">Pagos</th>
              <th className="text-center">Valor usd|ha</th>
              <th className="text-center">Valor $</th>
              <th className="text-center">Condición</th>
            </tr>
          </thead>
          <tbody>
            {data[key40].map((fila, index) => (
              <tr key={index}>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.pagos}
                    onChange={(e) => handleInputChange(key40, index, 'pagos', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.valorUsdHa}
                    onChange={(e) => handleInputChange(key40, index, 'valorUsdHa', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.valor}
                    onChange={(e) => handleInputChange(key40, index, 'valor', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
                  />
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={fila.condicion}
                    onChange={(e) => handleInputChange(key40, index, 'condicion', e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="3"
                    readOnly={errorCarga}
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
