import { Link, useNavigate, useParams } from 'react-router-dom'

function SeleccionPropietarioAlquiler() {
  const navigate = useNavigate()
  const { tipo } = useParams() // 'departamentos' o 'casas'

  const titulo = tipo === 'departamentos' ? 'Departamentos' : 'Casas'

  return (
    <div className="info-container">
      <h2 className="info-title">Seleccionar Propietario - {titulo}</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>Propietario</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link
                to={`/alquileres/${tipo}/yani`}
                className="info-link"
              >
                YANI
              </Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link
                to={`/alquileres/${tipo}/fabian`}
                className="info-link"
              >
                FABIÁN
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate('/alquileres')}
      >
        Volver
      </button>
    </div>
  )
}

export default SeleccionPropietarioAlquiler