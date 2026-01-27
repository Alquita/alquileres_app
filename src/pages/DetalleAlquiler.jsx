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

  // Función para formatear números con separador de miles
  const formatearNumero = (numero) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero)
  }

  // Detectar si es Puertas del Sol 2
  const esPuertasDelSol = tipo === 'departamentos' && propietario === 'yani' && id === 'puertas-del-sol'

  // Storage keys
  const storageKey = `alquiler-${tipo}-${propietario}-${id}`
  const storageKeyCochera = `alquiler-${tipo}-${propietario}-${id}-cochera`
  const contratoKey = `contrato-${tipo}-${propietario}-${id}`
  const notasGastosKey = `notas-gastos-${tipo}-${propietario}-${id}`
  const notasGastosKeyCochera = `notas-gastos-${tipo}-${propietario}-${id}-cochera`

  // Departamentos que tienen contrato
  const tieneContrato = () => {
    if (tipo !== 'departamentos') return false
    
    const deptosConContrato = {
      yani: ['puertas-del-sol', 'robles-viii', 'mares-iii', 'cielos-i'],
      fabian: ['egea-5', 'horenia-ii', 'marconi', 'robles-xiv-fabian', 'libertador-i']
    }
    
    return deptosConContrato[propietario]?.includes(id)
  }

  // Estado para datos del depto principal
  const [datos, setDatos] = useState(() => {
    const datosGuardados = localStorage.getItem(storageKey)
    if (datosGuardados) {
      return JSON.parse(datosGuardados)
    }
    return meses.map(mes => ({
      mes,
      alquiler: 0,
      gastos: 0,
      comisionAdm: 0
    }))
  })

  // Estado para datos de la cochera
  const [datosCochera, setDatosCochera] = useState(() => {
    if (!esPuertasDelSol) return []
    
    const datosGuardados = localStorage.getItem(storageKeyCochera)
    if (datosGuardados) {
      return JSON.parse(datosGuardados)
    }
    return meses.map(mes => ({
      mes,
      alquiler: 0,
      gastos: 0,
      comisionAdm: 0
    }))
  })

  const [contrato, setContrato] = useState(() => {
    const contratoGuardado = localStorage.getItem(contratoKey)
    return contratoGuardado || ''
  })

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

  const [notasGastosCochera, setNotasGastosCochera] = useState(() => {
    if (!esPuertasDelSol) return {}
    
    const notasGuardadas = localStorage.getItem(notasGastosKeyCochera)
    if (notasGuardadas) {
      return JSON.parse(notasGuardadas)
    }
    return meses.reduce((acc, mes) => {
      acc[mes] = ''
      return acc
    }, {})
  })

  const [notaEditando, setNotaEditando] = useState(null)
  const [notaEditandoCochera, setNotaEditandoCochera] = useState(null)

  // Guardar datos principales
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(datos))
  }, [datos, storageKey])

  // Guardar datos cochera
  useEffect(() => {
    if (esPuertasDelSol) {
      localStorage.setItem(storageKeyCochera, JSON.stringify(datosCochera))
    }
  }, [datosCochera, storageKeyCochera, esPuertasDelSol])

  useEffect(() => {
    if (tieneContrato()) {
      localStorage.setItem(contratoKey, contrato)
    }
  }, [contrato, contratoKey])

  useEffect(() => {
    localStorage.setItem(notasGastosKey, JSON.stringify(notasGastos))
  }, [notasGastos, notasGastosKey])

  useEffect(() => {
    if (esPuertasDelSol) {
      localStorage.setItem(notasGastosKeyCochera, JSON.stringify(notasGastosCochera))
    }
  }, [notasGastosCochera, notasGastosKeyCochera, esPuertasDelSol])

  const handleInputChange = (index, campo, valor) => {
    const nuevosDatos = [...datos]
    nuevosDatos[index][campo] = parseFloat(valor) || 0
    setDatos(nuevosDatos)
  }

  const handleInputChangeCochera = (index, campo, valor) => {
    const nuevosDatos = [...datosCochera]
    nuevosDatos[index][campo] = parseFloat(valor) || 0
    setDatosCochera(nuevosDatos)
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

  const handleNotaGastoChangeCochera = (mes, valor) => {
    setNotasGastosCochera(prev => ({
      ...prev,
      [mes]: valor
    }))
  }

  const calcularTotal = (alquiler, gastos, comisionAdm) => {
    return alquiler - (gastos || 0) - (comisionAdm || 0)
  }

  const tituloTipo = tipo === 'departamentos' ? 'Departamento' : 'Casa'
  const tituloPropietario = propietario === 'yani' ? 'Yani' : 'Fabián'

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">
        {tituloPropietario} – {propiedad?.nombre || tituloTipo}
      </h2>

      <div className="alquiler-content-wrapper">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Tabla principal */}
          <div className="alquiler-table-wrapper">
            <h3 className="subtitulo-tabla">
              {esPuertasDelSol ? 'Depto 10 F' : 'Año 2026'}
            </h3>
            <table className="table table-bordered alquiler-table-excel">
              <thead>
                <tr>
                  <th className="text-center">AÑO 2026</th>
                  <th className="text-center">Alquiler</th>
                  <th className="text-center">Exp. Extraordinaria</th>
                  <th className="text-center">Comisión Adm</th>
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
                    <td>
                      <input
                        type="number"
                        className="form-control alquiler-input-excel"
                        value={fila.comisionAdm || ''}
                        onChange={(e) => handleInputChange(index, 'comisionAdm', e.target.value)}
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
                      ${formatearNumero(calcularTotal(fila.alquiler, fila.gastos, fila.comisionAdm))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row-excel">
                  <td className="text-end fw-bold">TOTAL ANUAL:</td>
                  <td className="fw-bold">
                    ${formatearNumero(datos.reduce((sum, f) => sum + (f.alquiler || 0), 0))}
                  </td>
                  <td className="fw-bold">
                    ${formatearNumero(datos.reduce((sum, f) => sum + (f.gastos || 0), 0))}
                  </td>
                  <td className="fw-bold">
                    ${formatearNumero(datos.reduce((sum, f) => sum + (f.comisionAdm || 0), 0))}
                  </td>
                  <td></td>
                  <td className="fw-bold">
                    ${formatearNumero(datos.reduce((sum, f) => sum + calcularTotal(f.alquiler, f.gastos, f.comisionAdm), 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Tabla de cochera solo para Puertas del Sol */}
          {esPuertasDelSol && (
            <div className="alquiler-table-wrapper">
              <h3 className="subtitulo-tabla">Cochera 24</h3>
              <table className="table table-bordered alquiler-table-excel">
                <thead>
                  <tr>
                    <th className="text-center">AÑO 2026</th>
                    <th className="text-center">Alquiler</th>
                    <th className="text-center">Exp. Extraordinaria</th>
                    <th className="text-center">Comisión Adm</th>
                    <th className="text-center">Detalle</th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {datosCochera.map((fila, index) => (
                    <tr key={index}>
                      <td className="mes-cell-excel">{fila.mes}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control alquiler-input-excel"
                          value={fila.alquiler || ''}
                          onChange={(e) => handleInputChangeCochera(index, 'alquiler', e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control alquiler-input-excel"
                          value={fila.gastos || ''}
                          onChange={(e) => handleInputChangeCochera(index, 'gastos', e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control alquiler-input-excel"
                          value={fila.comisionAdm || ''}
                          onChange={(e) => handleInputChangeCochera(index, 'comisionAdm', e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td className="detalle-cell">
                        {notaEditandoCochera === fila.mes ? (
                          <input
                            type="text"
                            className="form-control nota-gasto-input"
                            value={notasGastosCochera[fila.mes] || ''}
                            onChange={(e) => handleNotaGastoChangeCochera(fila.mes, e.target.value)}
                            onBlur={() => setNotaEditandoCochera(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setNotaEditandoCochera(null)
                            }}
                            autoFocus
                            placeholder="Escribe aquí..."
                          />
                        ) : (
                          <button
                            className="nota-gasto-btn"
                            onClick={() => setNotaEditandoCochera(fila.mes)}
                            title="Click para editar detalle"
                          >
                            {notasGastosCochera[fila.mes] || '📝 Agregar detalle'}
                          </button>
                        )}
                      </td>
                      <td className="total-cell-excel">
                        ${formatearNumero(calcularTotal(fila.alquiler, fila.gastos, fila.comisionAdm))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row-excel">
                    <td className="text-end fw-bold">TOTAL ANUAL:</td>
                    <td className="fw-bold">
                      ${formatearNumero(datosCochera.reduce((sum, f) => sum + (f.alquiler || 0), 0))}
                    </td>
                    <td className="fw-bold">
                      ${formatearNumero(datosCochera.reduce((sum, f) => sum + (f.gastos || 0), 0))}
                    </td>
                    <td className="fw-bold">
                      ${formatearNumero(datosCochera.reduce((sum, f) => sum + (f.comisionAdm || 0), 0))}
                    </td>
                    <td></td>
                    <td className="fw-bold">
                      ${formatearNumero(datosCochera.reduce((sum, f) => sum + calcularTotal(f.alquiler, f.gastos, f.comisionAdm), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
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