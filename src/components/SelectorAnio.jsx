import { useAnio } from '../context/AnioContext'
import { ANIO_MINIMO } from '../services/syncService'

function SelectorAnio() {
  const { anioSeleccionado, setAnioSeleccionado } = useAnio()

  // Solo hay tope inferior: el primer año con registro
  const puedeRetroceder = anioSeleccionado > ANIO_MINIMO

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 mb-3 flex-wrap">
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => setAnioSeleccionado(anioSeleccionado - 1)}
        disabled={!puedeRetroceder}
        title="Año anterior"
      >
        ◀
      </button>
      <span className="fw-bold fs-5">{anioSeleccionado}</span>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => setAnioSeleccionado(anioSeleccionado + 1)}
        title="Año siguiente"
      >
        ▶
      </button>
    </div>
  )
}

export default SelectorAnio
