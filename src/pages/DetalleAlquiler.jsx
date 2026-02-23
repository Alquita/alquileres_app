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
  
  // Detectar si es Robles XIV de Fabián
  const esRoblesXIVFabian = tipo === 'departamentos' && propietario === 'fabian' && id === 'robles-xiv-fabian'

  // Storage keys
  const storageKey = `alquiler-${tipo}-${propietario}-${id}`
  const storageKeyCochera = `alquiler-${tipo}-${propietario}-${id}-cochera`
  const storageKeyDepto3C = `alquiler-${tipo}-${propietario}-${id}-depto3c`
  
  // Keys de contrato SEPARADOS por tabla
  const contratoKey = `contrato-${tipo}-${propietario}-${id}-principal`
  const contratoKeyCochera = `contrato-${tipo}-${propietario}-${id}-cochera`
  const contratoKeyDepto3C = `contrato-${tipo}-${propietario}-${id}-depto3c`
  
  const notasGastosKey = `notas-gastos-${tipo}-${propietario}-${id}`
  const notasGastosKeyCochera = `notas-gastos-${tipo}-${propietario}-${id}-cochera`
  const notasGastosKeyDepto3C = `notas-gastos-${tipo}-${propietario}-${id}-depto3c`

  // Departamentos que tienen contrato
  const tieneContrato = () => {
    if (tipo !== 'departamentos') return false
    
    const deptosConContrato = {
      yani: ['puertas-del-sol', 'robles-viii', 'mares-iii', 'cielos-i'],
      fabian: ['egea-5', 'horenia-ii', 'marconi', 'robles-xiv-fabian', 'libertador-i', 'jeremias']
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

  // Estado para datos de la cochera (Puertas del Sol)
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

  // Estado para datos del Depto 3C (Robles XIV Fabián)
  const [datosDepto3C, setDatosDepto3C] = useState(() => {
    if (!esRoblesXIVFabian) return []
    
    const datosGuardados = localStorage.getItem(storageKeyDepto3C)
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

  // Estados de contrato SEPARADOS
  const [contrato, setContrato] = useState(() => {
    const contratoGuardado = localStorage.getItem(contratoKey)
    return contratoGuardado || ''
  })

  const [contratoCochera, setContratoCochera] = useState(() => {
    if (!esPuertasDelSol) return ''
    const contratoGuardado = localStorage.getItem(contratoKeyCochera)
    return contratoGuardado || ''
  })

  const [contratoDepto3C, setContratoDepto3C] = useState(() => {
    if (!esRoblesXIVFabian) return ''
    const contratoGuardado = localStorage.getItem(contratoKeyDepto3C)
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

  const [notasGastosDepto3C, setNotasGastosDepto3C] = useState(() => {
    if (!esRoblesXIVFabian) return {}
    
    const notasGuardadas = localStorage.getItem(notasGastosKeyDepto3C)
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
  const [notaEditandoDepto3C, setNotaEditandoDepto3C] = useState(null)

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

  // Guardar datos Depto 3C
  useEffect(() => {
    if (esRoblesXIVFabian) {
      localStorage.setItem(storageKeyDepto3C, JSON.stringify(datosDepto3C))
    }
  }, [datosDepto3C, storageKeyDepto3C, esRoblesXIVFabian])

  // Guardar contratos SEPARADOS
  useEffect(() => {
    if (tieneContrato()) {
      localStorage.setItem(contratoKey, contrato)
    }
  }, [contrato, contratoKey])

  useEffect(() => {
    if (esPuertasDelSol && tieneContrato()) {
      localStorage.setItem(contratoKeyCochera, contratoCochera)
    }
  }, [contratoCochera, contratoKeyCochera, esPuertasDelSol])

  useEffect(() => {
    if (esRoblesXIVFabian && tieneContrato()) {
      localStorage.setItem(contratoKeyDepto3C, contratoDepto3C)
    }
  }, [contratoDepto3C, contratoKeyDepto3C, esRoblesXIVFabian])

  useEffect(() => {
    localStorage.setItem(notasGastosKey, JSON.stringify(notasGastos))
  }, [notasGastos, notasGastosKey])

  useEffect(() => {
    if (esPuertasDelSol) {
      localStorage.setItem(notasGastosKeyCochera, JSON.stringify(notasGastosCochera))
    }
  }, [notasGastosCochera, notasGastosKeyCochera, esPuertasDelSol])

  useEffect(() => {
    if (esRoblesXIVFabian) {
      localStorage.setItem(notasGastosKeyDepto3C, JSON.stringify(notasGastosDepto3C))
    }
  }, [notasGastosDepto3C, notasGastosKeyDepto3C, esRoblesXIVFabian])

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

  const handleInputChangeDepto3C = (index, campo, valor) => {
    const nuevosDatos = [...datosDepto3C]
    nuevosDatos[index][campo] = parseFloat(valor) || 0
    setDatosDepto3C(nuevosDatos)
  }

  const handleContratoChange = (e) => {
    setContrato(e.target.value)
  }

  const handleContratoCocheraChange = (e) => {
    setContratoCochera(e.target.value)
  }

  const handleContratoDepto3CChange = (e) => {
    setContratoDepto3C(e.target.value)
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

  const handleNotaGastoChangeDepto3C = (mes, valor) => {
    setNotasGastosDepto3C(prev => ({
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

      <div className="alquiler-tables-container">
        {/* Tabla principal - CON CONTRATO AL LADO para departamentos con contrato */}
        {tieneContrato() ? (
          <div className="alquiler-content-wrapper">
            <div className="alquiler-table-section">
              <div className="alquiler-table-wrapper">
                <h3 className="subtitulo-tabla">
                  {esPuertasDelSol ? 'Depto 10 F' : esRoblesXIVFabian ? 'Depto 4C' : 'Año 2026'}
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
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.alquiler || ''}
                              onChange={(e) => handleInputChange(index, 'alquiler', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.gastos || ''}
                              onChange={(e) => handleInputChange(index, 'gastos', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.comisionAdm || ''}
                              onChange={(e) => handleInputChange(index, 'comisionAdm', e.target.value)}
                              placeholder="0"
                            />
                          </div>
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
                </table>
              </div>
            </div>

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
          </div>
        ) : (
          // Tabla principal SIN CONTRATO para otros departamentos
          <div className="alquiler-table-wrapper">
            <h3 className="subtitulo-tabla">Año 2026</h3>
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
                      <div className="input-with-currency">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          className="form-control alquiler-input-excel"
                          value={fila.alquiler || ''}
                          onChange={(e) => handleInputChange(index, 'alquiler', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-with-currency">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          className="form-control alquiler-input-excel"
                          value={fila.gastos || ''}
                          onChange={(e) => handleInputChange(index, 'gastos', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-with-currency">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          className="form-control alquiler-input-excel"
                          value={fila.comisionAdm || ''}
                          onChange={(e) => handleInputChange(index, 'comisionAdm', e.target.value)}
                          placeholder="0"
                        />
                      </div>
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
            </table>
          </div>
        )}

        {/* Tabla de cochera solo para Puertas del Sol - CON CONTRATO PROPIO AL LADO */}
        {esPuertasDelSol && (
          <div className="alquiler-content-wrapper">
            <div className="alquiler-table-section">
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
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.alquiler || ''}
                              onChange={(e) => handleInputChangeCochera(index, 'alquiler', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.gastos || ''}
                              onChange={(e) => handleInputChangeCochera(index, 'gastos', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.comisionAdm || ''}
                              onChange={(e) => handleInputChangeCochera(index, 'comisionAdm', e.target.value)}
                              placeholder="0"
                            />
                          </div>
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
                </table>
              </div>
            </div>

            <div className="contrato-box">
              <h3 className="contrato-title">Contrato</h3>
              <textarea
                className="contrato-textarea"
                value={contratoCochera}
                onChange={handleContratoCocheraChange}
                placeholder="Escribe aquí los detalles del contrato..."
                rows="10"
              />
            </div>
          </div>
        )}

        {/* Tabla de Depto 3C solo para Robles XIV Fabián - CON CONTRATO PROPIO AL LADO */}
        {esRoblesXIVFabian && (
          <div className="alquiler-content-wrapper">
            <div className="alquiler-table-section">
              <div className="alquiler-table-wrapper">
                <h3 className="subtitulo-tabla">Depto 3C</h3>
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
                    {datosDepto3C.map((fila, index) => (
                      <tr key={index}>
                        <td className="mes-cell-excel">{fila.mes}</td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.alquiler || ''}
                              onChange={(e) => handleInputChangeDepto3C(index, 'alquiler', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.gastos || ''}
                              onChange={(e) => handleInputChangeDepto3C(index, 'gastos', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              className="form-control alquiler-input-excel"
                              value={fila.comisionAdm || ''}
                              onChange={(e) => handleInputChangeDepto3C(index, 'comisionAdm', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td className="detalle-cell">
                          {notaEditandoDepto3C === fila.mes ? (
                            <input
                              type="text"
                              className="form-control nota-gasto-input"
                              value={notasGastosDepto3C[fila.mes] || ''}
                              onChange={(e) => handleNotaGastoChangeDepto3C(fila.mes, e.target.value)}
                              onBlur={() => setNotaEditandoDepto3C(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setNotaEditandoDepto3C(null)
                              }}
                              autoFocus
                              placeholder="Escribe aquí..."
                            />
                          ) : (
                            <button
                              className="nota-gasto-btn"
                              onClick={() => setNotaEditandoDepto3C(fila.mes)}
                              title="Click para editar detalle"
                            >
                              {notasGastosDepto3C[fila.mes] || '📝 Agregar detalle'}
                            </button>
                          )}
                        </td>
                        <td className="total-cell-excel">
                          ${formatearNumero(calcularTotal(fila.alquiler, fila.gastos, fila.comisionAdm))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="contrato-box">
              <h3 className="contrato-title">Contrato</h3>
              <textarea
                className="contrato-textarea"
                value={contratoDepto3C}
                onChange={handleContratoDepto3CChange}
                placeholder="Escribe aquí los detalles del contrato..."
                rows="10"
              />
            </div>
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