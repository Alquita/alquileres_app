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
      propietario: 'fabian',
      id: 'robles-xiv-fabian',
      sufijo: 'depto3c',
      nombre: 'Depto 3C (Robles XIV)'
    }
  ]

  const [totalesMensuales, setTotalesMensuales] = useState([])
  const [porcentajeComision, setPorcentajeComision] = useState(() => {
    const guardado = localStorage.getItem('porcentaje-comision')
    return guardado ? parseFloat(guardado) : 0
  })

  useEffect(() => {
    calcularTotales()
  }, [])

  useEffect(() => {
    localStorage.setItem('porcentaje-comision', porcentajeComision.toString())
  }, [porcentajeComision])

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
            // Total = alquiler - gastos - comisionAdm
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
            // Total = alquiler - gastos - comisionAdm
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

  const calcularComision = (mitad) => {
    return (mitad * porcentajeComision) / 100
  }

  const totalAnual = totalesMensuales.reduce((sum, m) => sum + m.total, 0)
  const mitadAnual = totalesMensuales.reduce((sum, m) => sum + m.mitad, 0)

  return (
    <div className="alquiler-page-container">
      <h2 className="alquiler-page-title">Total Mensual - Todos los Alquileres</h2>

      <div className="comision-control">
        <label htmlFor="porcentaje-comision" className="comision-label">
          Porcentaje de Comisión:
        </label>
        <div className="comision-input-wrapper">
          <input
            id="porcentaje-comision"
            type="number"
            className="comision-input"
            value={porcentajeComision || ''}
            onChange={(e) => setPorcentajeComision(parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            max="100"
            step="0.1"
          />
          <span className="comision-symbol">%</span>
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
                  ${formatearNumero(calcularComision(fila.mitad))}
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
              <td className="fw-bold mitad-highlight">
                ${formatearNumero(mitadAnual)}
              </td>
              <td></td>
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