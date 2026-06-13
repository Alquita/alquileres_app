import { Link, useNavigate } from 'react-router-dom'

function SeleccionAlquileres() {
  const navigate = useNavigate()

  return (
    <div className="info-container">
      <h2 className="info-title">Seleccionar Categoría</h2>

      <div className="info-table-wrapper">
        <table className="table info-table text-center align-middle">
          <thead>
            <tr>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link
                  to="/alquileres/departamentos"
                  className="info-link"
                >
                  DEPARTAMENTOS
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link
                  to="/alquileres/casas"
                  className="info-link"
                >
                  CASAS
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link
                  to="/alquileres/campo"
                  className="info-link"
                >
                  CAMPO
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                <Link
                  to="/alquileres/total-mensual"
                  className="info-link"
                >
                  TOTAL MENSUAL
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
  )
}

export default SeleccionAlquileres