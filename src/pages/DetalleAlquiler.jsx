import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { loadProperty, saveProperty } from '../services/syncService'

function DetalleAlquiler() {
  const { tipo, propietario, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const propiedad = location.state

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const formatearNumero = (numero) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero)
  }

  const esPuertasDelSol = tipo === 'departamentos' && propietario === 'yani' && id === 'puertas-del-sol'
  const esRoblesXIVFabian = tipo === 'departamentos' && propietario === 'fabian' && id === 'robles-xiv-fabian'

  const tieneContrato = () => {
    if (tipo !== 'departamentos') return false
    const deptosConContrato = {
      yani: ['puertas-del-sol', 'robles-viii', 'mares-iii', 'cielos-i'],
      fabian: ['egea-5', 'horenia-ii', 'marconi', 'robles-xiv-fabian', 'libertador-i', 'jeremias']
    }
    return deptosConContrato[propietario]?.includes(id)
  }

  // ── Estado cargando ───────────────────────────────────────
  const [cargando, setCargando] = useState(true)

  // ── Estado modal ──────────────────────────────────────────
  const [modal, setModal] = useState(null)
  const [modalTexto, setModalTexto] = useState('')

  const abrirModal = (tabla, mes, textoActual) => {
    setModalTexto(textoActual || '')
    setModal({ tabla, mes })
  }

  const cerrarModal = (guardar) => {
    if (guardar && modal) {
      if (modal.tabla === 'principal') {
        setNotasGastos(prev => ({ ...prev, [modal.mes]: modalTexto }))
      } else if (modal.tabla === 'cochera') {
        setNotasGastosCochera(prev => ({ ...prev, [modal.mes]: modalTexto }))
      } else if (modal.tabla === 'depto3c') {
        setNotasGastosDepto3C(prev => ({ ...prev, [modal.mes]: modalTexto }))
      }
    }
    setModal(null)
    setModalTexto('')
  }

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') cerrarModal(false) }
    if (modal) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modal])

  // ── Estados vacíos ────────────────────────────────────────
  const [datos, setDatos] = useState([])
  const [datosCochera, setDatosCochera] = useState([])
  const [datosDepto3C, setDatosDepto3C] = useState([])
  const [contrato, setContrato] = useState('')
  const [contratoCochera, setContratoCochera] = useState('')
  const [contratoDepto3C, setContratoDepto3C] = useState('')
  const [notasGastos, setNotasGastos] = useState({})
  const [notasGastosCochera, setNotasGastosCochera] = useState({})
  const [notasGastosDepto3C, setNotasGastosDepto3C] = useState({})
  const [lockedMeses, setLockedMeses] = useState({})
  const [lockedMesesCochera, setLockedMesesCochera] = useState({})
  const [lockedMesesDepto3C, setLockedMesesDepto3C] = useState({})

  // ── Templates de inicialización ───────────────────────────
  const templateDatos = () => meses.map(mes => ({ mes, alquiler: 0, gastos: 0, comisionAdm: 0 }))
  const templateNotas = () => meses.reduce((acc, mes) => { acc[mes] = ''; return acc }, {})
  const templateLock = () => meses.reduce((acc, m) => { acc[m] = false; return acc }, {})

  // ── SUPABASE: cargar datos al montar ──────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setCargando(true)
      try {
        const data = await loadProperty(tipo, propietario, id)
        if (cancelled) return

        if (data) {
          setDatos(data.principal || templateDatos())
          setContrato(data.contrato_principal ?? '')
          setNotasGastos(data.notas_principal || templateNotas())
          setLockedMeses(data.lock_principal || templateLock())

          if (esPuertasDelSol) {
            setDatosCochera(data.cochera || templateDatos())
            setContratoCochera(data.contrato_cochera ?? '')
            setNotasGastosCochera(data.notas_cochera || templateNotas())
            setLockedMesesCochera(data.lock_cochera || templateLock())
          }

          if (esRoblesXIVFabian) {
            setDatosDepto3C(data.depto3c || templateDatos())
            setContratoDepto3C(data.contrato_depto3c ?? '')
            setNotasGastosDepto3C(data.notas_depto3c || templateNotas())
            setLockedMesesDepto3C(data.lock_depto3c || templateLock())
          }
        } else {
          setDatos(templateDatos())
          setNotasGastos(templateNotas())
          setLockedMeses(templateLock())
          if (esPuertasDelSol) {
            setDatosCochera(templateDatos())
            setNotasGastosCochera(templateNotas())
            setLockedMesesCochera(templateLock())
          }
          if (esRoblesXIVFabian) {
            setDatosDepto3C(templateDatos())
            setNotasGastosDepto3C(templateNotas())
            setLockedMesesDepto3C(templateLock())
          }
        }
      } finally {
        if (!cancelled) setCargando(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── SUPABASE: guardar cambios con debounce ────────────────
  const saveToSupabase = useCallback(async () => {
    const data = {
      principal: datos,
      contrato_principal: contrato,
      notas_principal: notasGastos,
      lock_principal: lockedMeses
    }
    if (esPuertasDelSol) {
      data.cochera = datosCochera
      data.contrato_cochera = contratoCochera
      data.notas_cochera = notasGastosCochera
      data.lock_cochera = lockedMesesCochera
    }
    if (esRoblesXIVFabian) {
      data.depto3c = datosDepto3C
      data.contrato_depto3c = contratoDepto3C
      data.notas_depto3c = notasGastosDepto3C
      data.lock_depto3c = lockedMesesDepto3C
    }
    await saveProperty(tipo, propietario, id, data)
  }, [datos, datosCochera, datosDepto3C, contrato, contratoCochera, contratoDepto3C,
      notasGastos, notasGastosCochera, notasGastosDepto3C,
      lockedMeses, lockedMesesCochera, lockedMesesDepto3C,
      esPuertasDelSol, esRoblesXIVFabian, tipo, propietario, id])

  useEffect(() => {
    if (cargando) return
    const timer = setTimeout(() => { saveToSupabase() }, 2000)
    return () => clearTimeout(timer)
  }, [datos, datosCochera, datosDepto3C, contrato, contratoCochera, contratoDepto3C,
      notasGastos, notasGastosCochera, notasGastosDepto3C,
      lockedMeses, lockedMesesCochera, lockedMesesDepto3C,
      esPuertasDelSol, esRoblesXIVFabian, saveToSupabase, cargando])

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

  const handleContratoChange = (e) => setContrato(e.target.value)
  const handleContratoCocheraChange = (e) => setContratoCochera(e.target.value)
  const handleContratoDepto3CChange = (e) => setContratoDepto3C(e.target.value)

  const toggleLock = (tabla, mes) => {
    if (tabla === 'principal') {
      setLockedMeses(prev => ({ ...prev, [mes]: !prev[mes] }))
    } else if (tabla === 'cochera') {
      setLockedMesesCochera(prev => ({ ...prev, [mes]: !prev[mes] }))
    } else if (tabla === 'depto3c') {
      setLockedMesesDepto3C(prev => ({ ...prev, [mes]: !prev[mes] }))
    }
  }

  const calcularTotal = (alquiler, gastos, comisionAdm) => {
    return alquiler - (gastos || 0) - (comisionAdm || 0)
  }

  const tituloTipo = tipo === 'departamentos' ? 'Departamento' : 'Casa'
  const tituloPropietario = propietario === 'yani' ? 'Yani' : 'Fabián'

  if (cargando) return <div className="text-center mt-5">Cargando...</div>

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
                        <td className="mes-cell-excel">
                          <span className="mes-cell-content">
                            {fila.mes}
                            <button
                              className={`lock-btn ${lockedMeses[fila.mes] ? 'lock-btn--locked' : 'lock-btn--unlocked'}`}
                              onClick={() => toggleLock('principal', fila.mes)}
                              title={lockedMeses[fila.mes] ? 'Desbloquear' : 'Bloquear'}
                            >
                              {lockedMeses[fila.mes] ? '🔒' : '🔓'}
                            </button>
                          </span>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMeses[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.alquiler || ''}
                              onChange={(e) => handleInputChange(index, 'alquiler', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMeses[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMeses[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.gastos || ''}
                              onChange={(e) => handleInputChange(index, 'gastos', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMeses[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMeses[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.comisionAdm || ''}
                              onChange={(e) => handleInputChange(index, 'comisionAdm', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMeses[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td className="detalle-cell">
                          <button
                            className={`nota-gasto-btn${notasGastos[fila.mes] ? ' nota-gasto-btn--con-texto' : ''}`}
                            onClick={() => abrirModal('principal', fila.mes, notasGastos[fila.mes])}
                            title="Click para ver/editar detalle"
                          >
                            {notasGastos[fila.mes]
                              ? <span className="nota-preview">{notasGastos[fila.mes]}</span>
                              : '📝 Agregar detalle'
                            }
                          </button>
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
                    <td className="mes-cell-excel">
                      <span className="mes-cell-content">
                        {fila.mes}
                        <button
                          className={`lock-btn ${lockedMeses[fila.mes] ? 'lock-btn--locked' : 'lock-btn--unlocked'}`}
                          onClick={() => toggleLock('principal', fila.mes)}
                          title={lockedMeses[fila.mes] ? 'Desbloquear' : 'Bloquear'}
                        >
                          {lockedMeses[fila.mes] ? '🔒' : '🔓'}
                        </button>
                      </span>
                    </td>
                    <td>
                      <div className="input-with-currency">
                        <span className="currency-symbol">$</span>
                        <input
                          type="text" inputMode="decimal"
                          className={`form-control alquiler-input-excel${lockedMeses[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                          value={fila.alquiler || ''}
                          onChange={(e) => handleInputChange(index, 'alquiler', e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          readOnly={lockedMeses[fila.mes]}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-with-currency">
                        <span className="currency-symbol">$</span>
                        <input
                          type="text" inputMode="decimal"
                          className={`form-control alquiler-input-excel${lockedMeses[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                          value={fila.gastos || ''}
                          onChange={(e) => handleInputChange(index, 'gastos', e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          readOnly={lockedMeses[fila.mes]}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-with-currency">
                        <span className="currency-symbol">$</span>
                        <input
                          type="text" inputMode="decimal"
                          className={`form-control alquiler-input-excel${lockedMeses[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                          value={fila.comisionAdm || ''}
                          onChange={(e) => handleInputChange(index, 'comisionAdm', e.target.value)}
                          onWheel={(e) => e.target.blur()}
                          readOnly={lockedMeses[fila.mes]}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="detalle-cell">
                      <button
                        className={`nota-gasto-btn${notasGastos[fila.mes] ? ' nota-gasto-btn--con-texto' : ''}`}
                        onClick={() => abrirModal('principal', fila.mes, notasGastos[fila.mes])}
                        title="Click para ver/editar detalle"
                      >
                        {notasGastos[fila.mes]
                          ? <span className="nota-preview">{notasGastos[fila.mes]}</span>
                          : '📝 Agregar detalle'
                        }
                      </button>
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

        {/* Tabla cochera - Puertas del Sol */}
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
                        <td className="mes-cell-excel">
                          <span className="mes-cell-content">
                            {fila.mes}
                            <button
                              className={`lock-btn ${lockedMesesCochera[fila.mes] ? 'lock-btn--locked' : 'lock-btn--unlocked'}`}
                              onClick={() => toggleLock('cochera', fila.mes)}
                              title={lockedMesesCochera[fila.mes] ? 'Desbloquear' : 'Bloquear'}
                            >
                              {lockedMesesCochera[fila.mes] ? '🔒' : '🔓'}
                            </button>
                          </span>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMesesCochera[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.alquiler || ''}
                              onChange={(e) => handleInputChangeCochera(index, 'alquiler', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMesesCochera[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMesesCochera[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.gastos || ''}
                              onChange={(e) => handleInputChangeCochera(index, 'gastos', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMesesCochera[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMesesCochera[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.comisionAdm || ''}
                              onChange={(e) => handleInputChangeCochera(index, 'comisionAdm', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMesesCochera[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td className="detalle-cell">
                          <button
                            className={`nota-gasto-btn${notasGastosCochera[fila.mes] ? ' nota-gasto-btn--con-texto' : ''}`}
                            onClick={() => abrirModal('cochera', fila.mes, notasGastosCochera[fila.mes])}
                            title="Click para ver/editar detalle"
                          >
                            {notasGastosCochera[fila.mes]
                              ? <span className="nota-preview">{notasGastosCochera[fila.mes]}</span>
                              : '📝 Agregar detalle'
                            }
                          </button>
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

        {/* Tabla Depto 3C - Robles XIV Fabián */}
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
                        <td className="mes-cell-excel">
                          <span className="mes-cell-content">
                            {fila.mes}
                            <button
                              className={`lock-btn ${lockedMesesDepto3C[fila.mes] ? 'lock-btn--locked' : 'lock-btn--unlocked'}`}
                              onClick={() => toggleLock('depto3c', fila.mes)}
                              title={lockedMesesDepto3C[fila.mes] ? 'Desbloquear' : 'Bloquear'}
                            >
                              {lockedMesesDepto3C[fila.mes] ? '🔒' : '🔓'}
                            </button>
                          </span>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMesesDepto3C[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.alquiler || ''}
                              onChange={(e) => handleInputChangeDepto3C(index, 'alquiler', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMesesDepto3C[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMesesDepto3C[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.gastos || ''}
                              onChange={(e) => handleInputChangeDepto3C(index, 'gastos', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMesesDepto3C[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="input-with-currency">
                            <span className="currency-symbol">$</span>
                            <input
                              type="text" inputMode="decimal"
                              className={`form-control alquiler-input-excel${lockedMesesDepto3C[fila.mes] ? ' alquiler-input--readonly' : ''}`}
                              value={fila.comisionAdm || ''}
                              onChange={(e) => handleInputChangeDepto3C(index, 'comisionAdm', e.target.value)}
                              onWheel={(e) => e.target.blur()}
                              readOnly={lockedMesesDepto3C[fila.mes]}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td className="detalle-cell">
                          <button
                            className={`nota-gasto-btn${notasGastosDepto3C[fila.mes] ? ' nota-gasto-btn--con-texto' : ''}`}
                            onClick={() => abrirModal('depto3c', fila.mes, notasGastosDepto3C[fila.mes])}
                            title="Click para ver/editar detalle"
                          >
                            {notasGastosDepto3C[fila.mes]
                              ? <span className="nota-preview">{notasGastosDepto3C[fila.mes]}</span>
                              : '📝 Agregar detalle'
                            }
                          </button>
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

      {/* ── MODAL DETALLE ────────────────────────────────────── */}
      {modal && (
        <div className="detalle-modal-overlay" onClick={() => cerrarModal(false)}>
          <div className="detalle-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detalle-modal-header">
              <h3 className="detalle-modal-title">Detalle – {modal.mes}</h3>
              <button className="detalle-modal-close" onClick={() => cerrarModal(false)}>✕</button>
            </div>
            <textarea
              className="detalle-modal-textarea"
              value={modalTexto}
              onChange={(e) => setModalTexto(e.target.value)}
              placeholder="Escribe el detalle aquí..."
              autoFocus
            />
            <div className="detalle-modal-footer">
              <button className="detalle-modal-btn detalle-modal-btn--cancelar" onClick={() => cerrarModal(false)}>
                Cancelar
              </button>
              <button className="detalle-modal-btn detalle-modal-btn--guardar" onClick={() => cerrarModal(true)}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetalleAlquiler