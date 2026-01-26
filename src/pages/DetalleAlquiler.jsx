import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function DetalleAlquiler() {
  const { tipo, propietario, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const propiedad = location.state

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

  // Crear una key única para cada propiedad
  const storageKey = `alquiler-${tipo}-${propietario}-${id}`
  const contratoKey = `contrato-${tipo}-${propietario}-${id}`
  const notasGastosKey = `notas-gastos-${tipo}-${propietario}-${id}`

  // Departamentos que tienen contrato (ahora incluye Mares III y Cielos I)
  const tieneContrato = () => {
    if (tipo !== 'departamentos') return false
    
    const deptosConContrato = {
      yani: ['puertas-del-sol', 'robles-viii', 'mares-iii', 'cielos-i'],
      fabian: ['egea-5', 'horenia-ii', 'marconi', 'robles-xiv-fabian', 'libertador-i']
    }
    
    return deptosConContrato[propietario]?.includes(id)
  }

  // Cargar datos guardados o inicializar con valores en 0
  const [datos, setDatos] = useState(() => {
    const datosGuardados = localStorage.getItem(storageKey)
    if (datosGuardados) {
      return JSON.parse(datosGuardados)
    }
    return meses.map(mes => ({
      mes,
      alquiler: 0,
      gastos: 0
    }))
  })

  // Estado para el contrato
  const [contrato, setContrato] = useState(() => {
    const contratoGuardado = localStorage.getItem(contratoKey)
    return contratoGuardado || ''
  })

  // Estado para las notas de gastos
  const [notasGastos, setNotasGastos] = useState(() => {
    const notasGuardadas = localStorage.getItem(notasGastosKey)
    if (notasGuardadas) {
      return JSON.parse(notasGuardadas)
    }
    return meses.reduce((acc, mes) => {
      acc[mes] = ''
      return acc
    }, {})
  })

  // Estado para controlar qué nota está siendo editada
  const [notaEditando, setNotaEditando] = useState(null)

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(datos))
  }, [datos, storageKey])

  // Guardar contrato en localStorage
  useEffect(() => {
    if (tieneContrato()) {
      localStorage.setItem(contratoKey, contrato)
    }
  }, [contrato, contratoKey])

  // Guardar notas de gastos en localStorage
  useEffect(() => {
    localStorage.setItem(notasGastosKey, JSON.stringify(notasGastos))
  }, [notasGastos, notasGastosKey])

  const handleInputChange = (index, campo, valor) => {
    const nuevosDatos = [...datos]
    nuevosDatos[index][campo] = parseFloat(valor) || 0
    setDatos(nuevosDatos)
  }

  const handleContratoChange = (e) => {
    setContrato(e.target.value)
  }

  const handleNotaGastoChange = (mes, valor) => {
    setNotasGastos(prev => ({
      ...prev,
      [mes]: valor
    }))
  }

  const calcularTotal = (alquiler, gastos) => {
    return alquiler - gastos
  }

  const tituloTipo = tipo === 'departamentos' ? 'Departamento' : 'Casa'
  const tituloPropietario = propietario === 'yani' ? 'Yani' : 'Fabián'

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">
        {tituloPropietario} – {propiedad?.nombre || tituloTipo}
      </h2>

      <div className="alquiler-content-wrapper">
        <div className="alquiler-table-wrapper">
          <table className="table table-bordered alquiler-table-excel">
            <thead>
              <tr>
                <th className="text-center">AÑO 2026</th>
                <th className="text-center">Alquiler</th>
                <th className="text-center">Gastos</th>
                <th className="text-center">Detalle</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((fila, index) => (
                <tr key={index}>
                  <td className="mes-cell-excel">{fila.mes}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control alquiler-input-excel"
                      value={fila.alquiler || ''}
                      onChange={(e) => handleInputChange(index, 'alquiler', e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control alquiler-input-excel"
                      value={fila.gastos || ''}
                      onChange={(e) => handleInputChange(index, 'gastos', e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="detalle-cell">
                    {notaEditando === fila.mes ? (
                      <input
                        type="text"
                        className="form-control nota-gasto-input"
                        value={notasGastos[fila.mes] || ''}
                        onChange={(e) => handleNotaGastoChange(fila.mes, e.target.value)}
                        onBlur={() => setNotaEditando(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setNotaEditando(null)
                        }}
                        autoFocus
                        placeholder="Escribe aquí..."
                      />
                    ) : (
                      <button
                        className="nota-gasto-btn"
                        onClick={() => setNotaEditando(fila.mes)}
                        title="Click para editar detalle"
                      >
                        {notasGastos[fila.mes] || '📝 Agregar detalle'}
                      </button>
                    )}
                  </td>
                  <td className="total-cell-excel">
                    ${calcularTotal(fila.alquiler, fila.gastos).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row-excel">
                <td className="text-end fw-bold">TOTAL ANUAL:</td>
                <td className="fw-bold">
                  ${datos.reduce((sum, f) => sum + f.alquiler, 0).toFixed(2)}
                </td>
                <td className="fw-bold">
                  ${datos.reduce((sum, f) => sum + f.gastos, 0).toFixed(2)}
                </td>
                <td></td>
                <td className="fw-bold">
                  ${datos.reduce((sum, f) => sum + calcularTotal(f.alquiler, f.gastos), 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {tieneContrato() && (
          <div className="contrato-box">
            <h3 className="contrato-title">Contrato</h3>
            <textarea
              className="contrato-textarea"
              value={contrato}
              onChange={handleContratoChange}
              placeholder="Escribe aquí los detalles del contrato..."
              rows="10"
            />
          </div>
        )}
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate(`/alquileres/${tipo}/${propietario}`)}
      >
        Volver
      </button>
    </div>
  )
}

export default DetalleAlquiler