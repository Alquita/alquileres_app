import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
      recibi: '',
      diferencia: ''
    }))
  })

  // Guardar en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(datos))
  }, [datos])

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
              <th className="text-center">Recibí</th>
              <th className="text-center">Diferencia</th>
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