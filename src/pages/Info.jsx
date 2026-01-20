import { Link, useNavigate } from 'react-router-dom'

function Info() {
  const navigate = useNavigate()

  const deptosYani = [
    { id: 'local', nombre: 'LOCAL', direccion: 'Buenos Aires 660', rentas: '2402522467384' },
    { id: 'puertas-del-sol', nombre: 'PUERTAS DEL SOL 2', direccion: 'Yrigoyen 1235 - Depto 10 F', direccion2: 'Cochera 24', rentas: '240543828905' , rentas2: '240543827941' },
    { id: 'robles-viii', nombre: 'ROBLES VIII', direccion: 'Alberdi 1037 - Depto 1 A', rentas: '240525517650' },
    { id: 'mares-iii', nombre: 'MARES III', direccion: 'Baigorria 609 - Depto B 3', rentas: '240542182441' },
    { id: 'cielos-i', nombre: 'CIELOS I', direccion: 'San Martín 465 - Depto 3 A', rentas: '240527342920' },
    { id: 'robles-xiv', nombre: 'ROBLES XIV', direccion: 'Buenos Aires 645 - Depto 4 A', direccion2: 'Cochera', rentas: '2405274534762', rentas2: '240543827941' }
  ]

  const deptosFabian = [
    { id: 'bentas', nombre: 'BENTAS', direccion: '', telefono: '2405224673884' }
  ]

  const maxLength = Math.max(deptosYani.length, deptosFabian.length)

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
          {Array.from({ length: maxLength }).map((_, index) => (
            <tr key={index}>
              <td>
                {deptosYani[index] ? (
                  <Link
                    to={`/info/yani/${deptosYani[index].id}`}
                    state={deptosYani[index]}
                    className="info-link"
                  >
                    {deptosYani[index].nombre}
                  </Link>
                ) : null}
              </td>
              <td>
                {deptosFabian[index] ? (
                  <Link
                    to={`/info/fabian/${deptosFabian[index].id}`}
                    state={deptosFabian[index]}
                    className="info-link"
                  >
                    {deptosFabian[index].nombre}
                  </Link>
                ) : null}
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