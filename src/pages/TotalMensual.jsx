import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function TotalMensual() {
  const navigate = useNavigate()

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

  const todasLasPropiedades = [
    { tipo: 'departamentos', propietario: 'yani', id: 'puertas-del-sol', nombre: 'Puertas del Sol 2' },
    { tipo: 'departamentos', propietario: 'yani', id: 'robles-viii', nombre: 'Robles VIII' },
    { tipo: 'departamentos', propietario: 'yani', id: 'mares-iii', nombre: 'Mares III' },
    { tipo: 'departamentos', propietario: 'yani', id: 'cielos-i', nombre: 'Cielos I' },
    { tipo: 'departamentos', propietario: 'yani', id: 'robles-xiv', nombre: 'Robles XIV' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'jeremias', nombre: 'Jeremias' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'marconi', nombre: 'Marconi' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'horenia-ii', nombre: 'Hovenia II' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'egea-5', nombre: 'Egea 5' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'robles-xiv-fabian', nombre: 'Robles XIV (F)' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'libertador-i', nombre: 'Libertador I' },
    { tipo: 'casas', propietario: 'yani', id: 'ochoa', nombre: 'Ochoa' },
    { tipo: 'casas', propietario: 'fabian', id: 'ARGUELLO', nombre: 'Arguello' },
    { tipo: 'casas', propietario: 'fabian', id: 'FLORENTIN', nombre: 'Florentin' },
    { tipo: 'casas', propietario: 'fabian', id: 'FALCO', nombre: 'Falco' },
    { tipo: 'casas', propietario: 'fabian', id: 'SUPAGA', nombre: 'Supaga' }
  ]

  const tablasSecundarias = [
    { tipo: 'departamentos', propietario: 'yani', id: 'puertas-del-sol', sufijo: 'cochera', nombre: 'Cochera 24 (Puertas del Sol)' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'robles-xiv-fabian', sufijo: 'depto3c', nombre: 'Depto 3C (Robles XIV)' }
  ]

  // Paleta de colores primarios y secundarios
  const coloresPaleta = [
    { nombre: 'Negro',   valor: '#212529' },
    { nombre: 'Rojo',    valor: '#dc3545' },
    { nombre: 'Azul',    valor: '#0d6efd' },
    { nombre: 'Amarillo',valor: '#ffc107' },
    { nombre: 'Verde',   valor: '#198754' },
    { nombre: 'Naranja', valor: '#fd7e14' },
    { nombre: 'Violeta', valor: '#6f42c1' },
    { nombre: 'Rosa',    valor: '#d63384' },
  ]

  const [totalesMensuales, setTotalesMensuales] = useState([])

  const [porcentajePrimerSemestre, setPorcentajePrimerSemestre] = useState(() => {
    const guardado = localStorage.getItem('porcentaje-comision-primer-semestre')
    return guardado ? parseFloat(guardado) : 0
  })

  const [porcentajeSegundoSemestre, setPorcentajeSegundoSemestre] = useState(() => {
    const guardado = localStorage.getItem('porcentaje-comision-segundo-semestre')
    return guardado ? parseFloat(guardado) : 0
  })

  // Condiciones: { texto, color } por mes
  const [condiciones, setCondiciones] = useState(() => {
    const guardado = localStorage.getItem('total-mensual-condiciones-v2')
    if (guardado) return JSON.parse(guardado)
    return Array(12).fill(null).map(() => ({ texto: '', color: '#212529' }))
  })

  useEffect(() => { calcularTotales() }, [])

  useEffect(() => {
    localStorage.setItem('porcentaje-comision-primer-semestre', porcentajePrimerSemestre.toString())
  }, [porcentajePrimerSemestre])

  useEffect(() => {
    localStorage.setItem('porcentaje-comision-segundo-semestre', porcentajeSegundoSemestre.toString())
  }, [porcentajeSegundoSemestre])

  useEffect(() => {
    localStorage.setItem('total-mensual-condiciones-v2', JSON.stringify(condiciones))
  }, [condiciones])

  const handleCondicionTexto = (index, valor) => {
    const nuevas = [...condiciones]
    nuevas[index] = { ...nuevas[index], texto: valor }
    setCondiciones(nuevas)
  }

  const handleCondicionColor = (index, color) => {
    const nuevas = [...condiciones]
    nuevas[index] = { ...nuevas[index], color }
    setCondiciones(nuevas)
  }

  const calcularTotales = () => {
    const totales = meses.map((mes, mesIndex) => {
      let totalMes = 0

      todasLasPropiedades.forEach(propiedad => {
        const storageKey = `alquiler-${propiedad.tipo}-${propiedad.propietario}-${propiedad.id}`
        const datosGuardados = localStorage.getItem(storageKey)
        if (datosGuardados) {
          const datos = JSON.parse(datosGuardados)
          const datosMes = datos[mesIndex]
          if (datosMes) {
            totalMes += (datosMes.alquiler || 0) - (datosMes.gastos || 0) - (datosMes.comisionAdm || 0)
          }
        }
      })

      tablasSecundarias.forEach(tablaSecundaria => {
        const storageKey = `alquiler-${tablaSecundaria.tipo}-${tablaSecundaria.propietario}-${tablaSecundaria.id}-${tablaSecundaria.sufijo}`
        const datosGuardados = localStorage.getItem(storageKey)
        if (datosGuardados) {
          const datos = JSON.parse(datosGuardados)
          const datosMes = datos[mesIndex]
          if (datosMes) {
            totalMes += (datosMes.alquiler || 0) - (datosMes.gastos || 0) - (datosMes.comisionAdm || 0)
          }
        }
      })

      return { mes, total: totalMes, mitad: totalMes / 2 }
    })

    setTotalesMensuales(totales)
  }

  const getPorcentajeComision = (mesIndex) =>
    mesIndex <= 5 ? porcentajePrimerSemestre : porcentajeSegundoSemestre

  const calcularComision = (mitad, mesIndex) =>
    (mitad * getPorcentajeComision(mesIndex)) / 100

  const calcularTransferir = (mitad, mesIndex) =>
    mitad - calcularComision(mitad, mesIndex)

  const totalAnual = totalesMensuales.reduce((sum, m) => sum + m.total, 0)

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Total Mensual - Todos los Alquileres</h2>

      <div className="comision-semestres-container">
        <div className="comision-control">
          <label htmlFor="porcentaje-primer-semestre" className="comision-label">
            Comisión Enero - Junio:
          </label>
          <div className="comision-input-wrapper">
            <input
              id="porcentaje-primer-semestre"
              type="number"
              className="comision-input"
              value={porcentajePrimerSemestre || ''}
              onChange={(e) => setPorcentajePrimerSemestre(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0" max="100" step="0.1"
            />
            <span className="comision-symbol">%</span>
          </div>
        </div>

        <div className="comision-control">
          <label htmlFor="porcentaje-segundo-semestre" className="comision-label">
            Comisión Julio - Diciembre:
          </label>
          <div className="comision-input-wrapper">
            <input
              id="porcentaje-segundo-semestre"
              type="number"
              className="comision-input"
              value={porcentajeSegundoSemestre || ''}
              onChange={(e) => setPorcentajeSegundoSemestre(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0" max="100" step="0.1"
            />
            <span className="comision-symbol">%</span>
          </div>
        </div>
      </div>

      <div className="alquiler-table-wrapper">
        <table className="table table-bordered alquiler-table-excel">
          <thead>
            <tr>
              <th className="text-center">Mes</th>
              <th className="text-center">Total</th>
              <th className="text-center">Mitad (÷2)</th>
              <th className="text-center">Comisión</th>
              <th className="text-center">Transferir</th>
              <th className="text-center">Condición</th>
            </tr>
          </thead>
          <tbody>
            {totalesMensuales.map((fila, index) => (
              <tr key={index}>
                <td className="mes-cell-excel">{fila.mes}</td>
                <td className="total-cell-excel">${formatearNumero(fila.total)}</td>
                <td className="total-cell-excel mitad-highlight">${formatearNumero(fila.mitad)}</td>
                <td className="total-cell-excel comision-highlight">${formatearNumero(calcularComision(fila.mitad, index))}</td>
                <td className="total-cell-excel transferir-highlight">${formatearNumero(calcularTransferir(fila.mitad, index))}</td>
                <td style={{ minWidth: 200, padding: '0.5rem 0.6rem', verticalAlign: 'top' }}>
                  {/* Paleta de colores */}
                  <div style={{
                    display: 'flex',
                    gap: 5,
                    marginBottom: 6,
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    {coloresPaleta.map((color) => {
                      const seleccionado = condiciones[index]?.color === color.valor
                      return (
                        <button
                          key={color.valor}
                          title={color.nombre}
                          onClick={() => handleCondicionColor(index, color.valor)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: color.valor,
                            border: seleccionado ? '2px solid #fff' : '2px solid transparent',
                            outline: seleccionado ? `2px solid ${color.valor}` : 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'transform 0.15s',
                            boxShadow: seleccionado
                              ? `0 0 0 2px ${color.valor}, 0 2px 6px rgba(0,0,0,0.25)`
                              : '0 1px 3px rgba(0,0,0,0.2)',
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      )
                    })}
                  </div>
                  {/* Textarea con color seleccionado */}
                  <textarea
                    className="form-control campo-textarea"
                    value={condiciones[index]?.texto || ''}
                    onChange={(e) => handleCondicionTexto(index, e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="2"
                    style={{
                      color: condiciones[index]?.color || '#212529',
                      fontWeight: 600,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row-excel">
              <td className="text-end fw-bold">TOTAL ANUAL:</td>
              <td className="fw-bold">${formatearNumero(totalAnual)}</td>
            </tr>
          </tfoot>
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

export default TotalMensual