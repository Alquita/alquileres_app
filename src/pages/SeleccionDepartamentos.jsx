import { Link, useNavigate } from 'react-router-dom'

function SeleccionDepartamentos() {
  const navigate = useNavigate()

  return (
    <div className="info-container">
      <h2 className="info-title">Seleccionar Categoría</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>Categoría de Departamentos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link
                to="/departamentos/yani"
                className="info-link"
              >
                DEPARTAMENTOS YANI
              </Link>
            </td>
          </tr>
          <tr>
            <td>
              <Link
                to="/departamentos/fabian"
                className="info-link"
              >
                DEPARTAMENTOS FABIAN
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
  )
}

export default SeleccionDepartamentos