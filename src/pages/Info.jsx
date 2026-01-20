import { Link, useNavigate } from 'react-router-dom'

function Info() {
  const navigate = useNavigate()

  const deptos = [
    { id: 1, nombre: 'Depto 1' },
    { id: 2, nombre: 'Depto 2' },
    { id: 3, nombre: 'Depto 3' },
  ]

  return (
    <div className="info-container">
      <h2 className="info-title">Información de Departamentos</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>Yani</th>
            <th>Fabián</th>
          </tr>
        </thead>
        <tbody>
          {deptos.map(depto => (
            <tr key={depto.id}>
              <td>
                <Link
                  to={`/info/yani/${depto.id}`}
                  className="info-link"
                >
                  {depto.nombre}
                </Link>
              </td>
              <td>
                <Link
                  to={`/info/fabian/${depto.id}`}
                  className="info-link"
                >
                  {depto.nombre}
                </Link>
              </td>
            </tr>
          ))}
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

export default Info
