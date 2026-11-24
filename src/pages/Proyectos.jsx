import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { loadPagosHijo, savePagosHijo } from '../services/syncService'
import { useAnio } from '../context/AnioContext'
import SelectorAnio from '../components/SelectorAnio'
import CheckEstado from '../components/CheckEstado'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

// Columnas de check de la tabla Proyectos
const checks = [
  { campo: 'gym', nombre: 'Gym' },
  { campo: 'julio', nombre: 'Julio' },
  { campo: 'uriel', nombre: 'Uriel' }
]

// Año sin fila: todo vacío (estados en 'ninguno', montos en 0, condiciones en '')
function crearVacio() {
  return {
    proyectos: meses.map(mes => ({ mes, gym: 'ninguno', julio: 'ninguno', uriel: 'ninguno', monto: 0, condicion: '' })),
    odoxeus: meses.map(mes => ({ mes, monto: 0, condicion: '' }))
  }
}

// Completar lo que venga de la base sobre la plantilla (por si falta algún campo)
function normalizar(dbData) {
  const vacio = crearVacio()
  return {
    proyectos: vacio.proyectos.map((fila, i) => ({ ...fila, ...(dbData?.proyectos?.[i] || {}), mes: fila.mes })),
    odoxeus: vacio.odoxeus.map((fila, i) => ({ ...fila, ...(dbData?.odoxeus?.[i] || {}), mes: fila.mes }))
  }
}

function Proyectos() {
  const navigate = useNavigate()
  const { anioSeleccionado } = useAnio()

  const [cargando, setCargando] = useState(true)
  const [data, setData] = useState(crearVacio)
  // Año al que pertenecen los datos en pantalla (el save SIEMPRE usa este)
  const [anioCargado, setAnioCargado] = useState(null)
  // Error al consultar Supabase: bloquea edición y autosave hasta reintentar OK
  const [errorCarga, setErrorCarga] = useState(false)
  const [intento, setIntento] = useState(0)
  // Snapshot de lo cargado: si no cambió, no se guarda (no crea filas sin editar)
  const baseRef = useRef(null)
  // Cambio pendiente del debounce, con su propio año
  const pendienteRef = useRef(null)
  // Contador de cargas, para ignorar saves viejos que terminan tarde
  const cargaRef = useRef(0)

  // ── SUPABASE: cargar el año seleccionado ──────────────────
  useEffect(() => {
    let cancelled = false
    const anio = anioSeleccionado
    cargaRef.current += 1
    async function load() {
      setCargando(true)
      setErrorCarga(false)
      baseRef.current = null
      try {
        const dbData = await loadPagosHijo(anio)
        if (cancelled) return

        setData(dbData ? normalizar(dbData) : crearVacio())
        setAnioCargado(anio)
      } catch {
        if (!cancelled) {
          setAnioCargado(null)
          setErrorCarga(true)
          toast.error('No se pudieron cargar los datos de la base. Comprobá tu conexión y reintentá.')
        }
      } finally {
        if (!cancelled) setCargando(false)
      }
    }
    load()
    return () => {
      cancelled = true
      // Al cambiar de año o salir: el debounce ya se canceló, guardar lo pendiente en SU año
      const pendiente = pendienteRef.current
      if (pendiente) {
        pendienteRef.current = null
        savePagosHijo(pendiente.anio, pendiente.data)
      }
    }
  }, [anioSeleccionado, intento])

  // ── SUPABASE: autosave con debounce ───────────────────────
  useEffect(() => {
    if (cargando || errorCarga || anioCargado !== anioSeleccionado) return

    const json = JSON.stringify(data)

    // Primera pasada después de cargar: solo tomar el snapshot
    if (baseRef.current === null) { baseRef.current = json; return }
    if (json === baseRef.current) { pendienteRef.current = null; return }

    const snapshot = JSON.parse(json)
    const anio = anioCargado
    const carga = cargaRef.current
    pendienteRef.current = { anio, data: snapshot }
    const timer = setTimeout(async () => {
      pendienteRef.current = null
      const ok = await savePagosHijo(anio, snapshot)
      if (ok && carga === cargaRef.current) baseRef.current = json
    }, 2000)
    return () => clearTimeout(timer)
  }, [data, cargando, errorCarga, anioCargado, anioSeleccionado])

  const cambiarFila = (tabla, index, campo, valor) => {
    setData(prev => ({
      ...prev,
      [tabla]: prev[tabla].map((fila, i) => (i === index ? { ...fila, [campo]: valor } : fila))
    }))
  }

  if (errorCarga) return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Proyectos</h2>
      <SelectorAnio />
      <div className="alert alert-warning mt-3">
        No se pudieron cargar los datos de la base. La edición está bloqueada para no borrar
        nada. Comprobá tu conexión y tocá Reintentar.
        <div className="mt-2">
          <button className="btn btn-primary btn-sm" onClick={() => setIntento(n => n + 1)}>
            Reintentar
          </button>
        </div>
      </div>
      <button className="btn btn-secondary mt-4" onClick={() => navigate('/')}>
        Volver
      </button>
    </div>
  )

  if (cargando || anioCargado !== anioSeleccionado) return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Proyectos</h2>
      <SelectorAnio />
      <div className="text-center mt-5">Cargando...</div>
    </div>
  )

  // Celdas de monto y condición (iguales en las dos tablas)
  const celdasMontoCondicion = (tabla, fila, index) => (
    <>
      <td>
        <div className="input-with-currency">
          <span className="currency-symbol">$</span>
          <input
            type="text" inputMode="decimal"
            className="form-control alquiler-input-excel"
            value={fila.monto || ''}
            onChange={(e) => cambiarFila(tabla, index, 'monto', parseFloat(e.target.value) || 0)}
            onWheel={(e) => e.target.blur()}
            placeholder="0"
            aria-label={`Monto ${fila.mes}`}
          />
        </div>
      </td>
      <td>
        <textarea
          className="form-control campo-textarea"
          value={fila.condicion}
          onChange={(e) => cambiarFila(tabla, index, 'condicion', e.target.value)}
          placeholder="Escribe aquí..."
          rows="2"
          aria-label={`Condición ${fila.mes}`}
        />
      </td>
    </>
  )

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Proyectos</h2>
      <SelectorAnio />

      <div className="alquiler-table-wrapper">
        <h3 className="subtitulo-tabla">Proyectos</h3>
        <table className="table table-bordered alquiler-table-excel">
          <thead>
            <tr>
              <th className="text-center">AÑO {anioSeleccionado}</th>
              {checks.map(c => <th key={c.campo} className="text-center">{c.nombre}</th>)}
              <th className="text-center">Monto</th>
              <th className="text-center">Condición</th>
            </tr>
          </thead>
          <tbody>
            {data.proyectos.map((fila, index) => (
              <tr key={fila.mes}>
                <td className="mes-cell-excel">{fila.mes}</td>
                {checks.map(c => (
                  <td key={c.campo} className="text-center align-middle">
                    <CheckEstado
                      valor={fila[c.campo]}
                      onChange={(nuevo) => cambiarFila('proyectos', index, c.campo, nuevo)}
                      etiqueta={`${c.nombre}, ${fila.mes}`}
                    />
                  </td>
                ))}
                {celdasMontoCondicion('proyectos', fila, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alquiler-table-wrapper mt-5">
        <h3 className="subtitulo-tabla">Odoxeus</h3>
        <table className="table table-bordered alquiler-table-excel">
          <thead>
            <tr>
              <th className="text-center">AÑO {anioSeleccionado}</th>
              <th className="text-center">Monto</th>
              <th className="text-center">Condición</th>
            </tr>
          </thead>
          <tbody>
            {data.odoxeus.map((fila, index) => (
              <tr key={fila.mes}>
                <td className="mes-cell-excel">{fila.mes}</td>
                {celdasMontoCondicion('odoxeus', fila, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/')}>
        Volver
      </button>
    </div>
  )
}

export default Proyectos
