import { Link, useNavigate, useParams } from 'react-router-dom'

function ListaAlquileres() {
  const navigate = useNavigate()
  const { tipo, propietario } = useParams()

  // Departamentos de Yani
  const deptosYani = [
    { id: 'puertas-del-sol', nombre: 'PUERTAS DEL SOL 2' },
    { id: 'robles-viii', nombre: 'ROBLES VIII' },
    { id: 'mares-iii', nombre: 'MARES III' },
    { id: 'cielos-i', nombre: 'CIELOS I' },
    { id: 'robles-xiv', nombre: 'ROBLES XIV' }
  ]

  // Departamentos de Fabián
  const deptosFabian = [
    { id: 'jeremias', nombre: 'JEREMIAS' },
    { id: 'marconi', nombre: 'MARCONI' },
    { id: 'horenia-ii', nombre: 'HOVENIA II' },
    { id: 'egea-5', nombre: 'EGEA 5' },
    { id: 'robles-xiv-fabian', nombre: 'ROBLES XIV' },
    { id: 'libertador-i', nombre: 'LIBERTADOR I' }
  ]

  // Casas de Yani
  const casasYani = [
    { id: 'ochoa', nombre: 'OCHOA' }
  ]

  // Casas de Fabián (agrega las que correspondan)
  const casasFabian = [
    { id: 'ARGUELLO', nombre: 'ARGUELLO' },
    { id: 'FLORENTIN', nombre: 'FLORENTIN' },
    { id: 'FALCO', nombre: 'FALCO' },
    { id: 'SUPAGA', nombre: 'SUPAGA' },

  ]

  // Determinar qué propiedades mostrar
  let propiedades = []
  if (tipo === 'departamentos') {
    propiedades = propietario === 'yani' ? deptosYani : deptosFabian
  } else {
    propiedades = propietario === 'yani' ? casasYani : casasFabian
  }

  const tituloTipo = tipo === 'departamentos' ? 'Departamentos' : 'Casas'
  const tituloPropietario = propietario === 'yani' ? 'Yani' : 'Fabián'

  return (
    <div className="info-container">
      <h2 className="info-title">Alquileres - {tituloTipo} de {tituloPropietario}</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>{tituloPropietario}</th>
          </tr>
        </thead>
        <tbody>
          {propiedades.map((propiedad) => (
            <tr key={propiedad.id}>
              <td>
                <Link
                  to={`/alquileres/${tipo}/${propietario}/${propiedad.id}`}
                  state={{ nombre: propiedad.nombre }}
                  className="info-link"
                >
                  {propiedad.nombre}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate(`/alquileres/${tipo}`)}
      >
        Volver
      </button>
    </div>
  )
}

export default ListaAlquileres