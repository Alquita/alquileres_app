import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function TotalMensual() {
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

  // Función para formatear números con separador de miles
  const formatearNumero = (numero) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero)
  }

  // Todas las propiedades principales
  const todasLasPropiedades = [
    // Departamentos Yani
    { tipo: 'departamentos', propietario: 'yani', id: 'puertas-del-sol', nombre: 'Puertas del Sol 2' },
    { tipo: 'departamentos', propietario: 'yani', id: 'robles-viii', nombre: 'Robles VIII' },
    { tipo: 'departamentos', propietario: 'yani', id: 'mares-iii', nombre: 'Mares III' },
    { tipo: 'departamentos', propietario: 'yani', id: 'cielos-i', nombre: 'Cielos I' },
    { tipo: 'departamentos', propietario: 'yani', id: 'robles-xiv', nombre: 'Robles XIV' },
    
    // Departamentos Fabián
    { tipo: 'departamentos', propietario: 'fabian', id: 'jeremias', nombre: 'Jeremias' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'marconi', nombre: 'Marconi' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'horenia-ii', nombre: 'Hovenia II' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'egea-5', nombre: 'Egea 5' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'robles-xiv-fabian', nombre: 'Robles XIV (F)' },
    { tipo: 'departamentos', propietario: 'fabian', id: 'libertador-i', nombre: 'Libertador I' },
    
    // Casas Yani
    { tipo: 'casas', propietario: 'yani', id: 'ochoa', nombre: 'Ochoa' },
    
    // Casas Fabián
    { tipo: 'casas', propietario: 'fabian', id: 'ARGUELLO', nombre: 'Arguello' },
    { tipo: 'casas', propietario: 'fabian', id: 'FLORENTIN', nombre: 'Florentin' },
    { tipo: 'casas', propietario: 'fabian', id: 'FALCO', nombre: 'Falco' },
    { tipo: 'casas', propietario: 'fabian', id: 'SUPAGA', nombre: 'Supaga' }
  ]

  // Tablas secundarias que también hay que sumar
  const tablasSecundarias = [
    {
      tipo: 'departamentos',
      propietario: 'yani',
      id: 'puertas-del-sol',
      sufijo: 'cochera',
      nombre: 'Cochera 24 (Puertas del Sol)'
    },
    {
      tipo: 'departamentos',
      propietario: 'fabian',
      id: 'robles-xiv-fabian',
      sufijo: 'depto3c',
      nombre: 'Depto 3C (Robles XIV)'
    }
  ]

  const [totalesMensuales, setTotalesMensuales] = useState([])
  
  // Dos porcentajes: uno para enero-junio, otro para julio-diciembre
  const [porcentajePrimerSemestre, setPorcentajePrimerSemestre] = useState(() => {
    const guardado = localStorage.getItem('porcentaje-comision-primer-semestre')
    return guardado ? parseFloat(guardado) : 0
  })
  
  const [porcentajeSegundoSemestre, setPorcentajeSegundoSemestre] = useState(() => {
    const guardado = localStorage.getItem('porcentaje-comision-segundo-semestre')
    return guardado ? parseFloat(guardado) : 0
  })

  // Condiciones por mes
  const [condiciones, setCondiciones] = useState(() => {
    const guardado = localStorage.getItem('total-mensual-condiciones')
    return guardado ? JSON.parse(guardado) : Array(12).fill('')
  })

  useEffect(() => {
    calcularTotales()
  }, [])

  useEffect(() => {
    localStorage.setItem('porcentaje-comision-primer-semestre', porcentajePrimerSemestre.toString())
  }, [porcentajePrimerSemestre])

  useEffect(() => {
    localStorage.setItem('porcentaje-comision-segundo-semestre', porcentajeSegundoSemestre.toString())
  }, [porcentajeSegundoSemestre])

  useEffect(() => {
    localStorage.setItem('total-mensual-condiciones', JSON.stringify(condiciones))
  }, [condiciones])

  const handleCondicionChange = (index, valor) => {
    const nuevasCondiciones = [...condiciones]
    nuevasCondiciones[index] = valor
    setCondiciones(nuevasCondiciones)
  }

  const calcularTotales = () => {
    const totales = meses.map((mes, mesIndex) => {
      let totalMes = 0

      // 1. Sumar todas las propiedades principales
      todasLasPropiedades.forEach(propiedad => {
        const storageKey = `alquiler-${propiedad.tipo}-${propiedad.propietario}-${propiedad.id}`
        const datosGuardados = localStorage.getItem(storageKey)
        
        if (datosGuardados) {
          const datos = JSON.parse(datosGuardados)
          const datosMes = datos[mesIndex]
          
          if (datosMes) {
            const totalDepto = (datosMes.alquiler || 0) - (datosMes.gastos || 0) - (datosMes.comisionAdm || 0)
            totalMes += totalDepto
          }
        }
      })

      // 2. Sumar también las tablas secundarias (Cochera 24 y Depto 3C)
      tablasSecundarias.forEach(tablaSecundaria => {
        const storageKey = `alquiler-${tablaSecundaria.tipo}-${tablaSecundaria.propietario}-${tablaSecundaria.id}-${tablaSecundaria.sufijo}`
        const datosGuardados = localStorage.getItem(storageKey)
        
        if (datosGuardados) {
          const datos = JSON.parse(datosGuardados)
          const datosMes = datos[mesIndex]
          
          if (datosMes) {
            const totalTablaSecundaria = (datosMes.alquiler || 0) - (datosMes.gastos || 0) - (datosMes.comisionAdm || 0)
            totalMes += totalTablaSecundaria
          }
        }
      })

      const mitad = totalMes / 2

      return {
        mes,
        total: totalMes,
        mitad
      }
    })

    setTotalesMensuales(totales)
  }

  // Función que determina qué porcentaje usar según el mes
  const getPorcentajeComision = (mesIndex) => {
    return mesIndex <= 5 ? porcentajePrimerSemestre : porcentajeSegundoSemestre
  }

  const calcularComision = (mitad, mesIndex) => {
    const porcentaje = getPorcentajeComision(mesIndex)
    return (mitad * porcentaje) / 100
  }

  const calcularTransferir = (mitad, mesIndex) => {
    const comision = calcularComision(mitad, mesIndex)
    return mitad - comision
  }

  const totalAnual = totalesMensuales.reduce((sum, m) => sum + m.total, 0)
  const mitadAnual = totalesMensuales.reduce((sum, m) => sum + m.mitad, 0)
  const comisionAnual = totalesMensuales.reduce((sum, m, index) => sum + calcularComision(m.mitad, index), 0)
  const transferirAnual = totalesMensuales.reduce((sum, m, index) => sum + calcularTransferir(m.mitad, index), 0)

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
              min="0"
              max="100"
              step="0.1"
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
              min="0"
              max="100"
              step="0.1"
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
                <td className="total-cell-excel">
                  ${formatearNumero(fila.total)}
                </td>
                <td className="total-cell-excel mitad-highlight">
                  ${formatearNumero(fila.mitad)}
                </td>
                <td className="total-cell-excel comision-highlight">
                  ${formatearNumero(calcularComision(fila.mitad, index))}
                </td>
                <td className="total-cell-excel transferir-highlight">
                  ${formatearNumero(calcularTransferir(fila.mitad, index))}
                </td>
                <td>
                  <textarea
                    className="form-control campo-textarea"
                    value={condiciones[index]}
                    onChange={(e) => handleCondicionChange(index, e.target.value)}
                    placeholder="Escribe aquí..."
                    rows="2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row-excel">
              <td className="text-end fw-bold">TOTAL ANUAL:</td>
              <td className="fw-bold">
                ${formatearNumero(totalAnual)}
              </td>
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