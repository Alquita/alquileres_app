import { Link, useNavigate, useParams } from 'react-router-dom'

function Departamentos() {
  const navigate = useNavigate()
  const { categoria } = useParams()

  // Solo departamentos de Yani (sin casas ni campos)
  const deptosYani = [
    { 
      id: 'puertas-del-sol', 
      nombre: 'PUERTAS DEL SOL 2'
    },
    { 
      id: 'robles-viii', 
      nombre: 'ROBLES VIII'
    },
    { 
      id: 'mares-iii', 
      nombre: 'MARES III'
    },
    { 
      id: 'cielos-i', 
      nombre: 'CIELOS I'
    },
    { 
      id: 'robles-xiv', 
      nombre: 'ROBLES XIV'
    }
  ]

  // Solo departamentos de Fabián (sin casas ni campos)
  const deptosFabian = [
    { 
      id: 'jeremias', 
      nombre: 'JEREMIAS'
    },
    { 
      id: 'marconi', 
      nombre: 'MARCONI'
    },
    { 
      id: 'horenia-ii', 
      nombre: 'HOVENIA II'
    },
    { 
      id: 'egea-5', 
      nombre: 'EGEA 5'
    },
    { 
      id: 'robles-xiv-fabian', 
      nombre: 'ROBLES XIV'
    },
    { 
      id: 'libertador-i', 
      nombre: 'LIBERTADOR I'
    }
  ]

  // Datos completos de departamentos de Yani
  const deptosYaniCompletos = [
    { 
      id: 'puertas-del-sol', 
      nombre: 'PUERTAS DEL SOL 2', 
      direccion: 'Yrigoyen 1235 - Depto 10 F', 
      direccion2: 'Cochera 24', 
      rentas: '240543828905', 
      rentas2: '240543827941',
      municipal: ['1', '2', '188', '100', '120'],
      municipal2: ['1', '2', '188', '100', '24']
    },
    { 
      id: 'robles-viii', 
      nombre: 'ROBLES VIII', 
      direccion: 'Alberdi 1037 - Depto 1 A', 
      rentas: '240525517650',
      municipal: ['1', '2', '163', '25', '9']
    },
    { 
      id: 'mares-iii', 
      nombre: 'MARES III', 
      direccion: 'Baigorria 609 - Depto B 3', 
      rentas: '240542182441',
      municipal: ['1', '2', '79', '101', '66']
    },
    { 
      id: 'cielos-i', 
      nombre: 'CIELOS I', 
      direccion: 'San Martín 465 - Depto 3 A', 
      rentas: '240527342920',
      municipal: ['1', '1', '60', '3', '14']
    },
    { 
      id: 'robles-xiv', 
      nombre: 'ROBLES XIV', 
      direccion: 'Buenos Aires 645 - Depto 4 A', 
      direccion2: 'Cochera', 
      rentas: '240527453462', 
      rentas2: '240527453209',
      municipal: ['1', '1', '69', '5', '42'],
      municipal2: ['1', '1', '69', '5', '16'],
      ecogas: '21100705',
      epec: '01520789 - 0138872301'
    }
  ]

  // Datos completos de departamentos de Fabián
  const deptosFabianCompletos = [
    { 
      id: 'jeremias', 
      nombre: 'JEREMIAS', 
      direccion: 'Av. Italia 1158 - Depto 3 D', 
      rentas: '240540032883',
      municipal: ['1', '1', '100', '10', '23']
    },
    { 
      id: 'marconi', 
      nombre: 'MARCONI', 
      direccion: 'Marconi 515 - Depto 6 B', 
      rentas: '240527370249',
      municipal: ['1', '1', '5', '7', '19']
    },
    { 
      id: 'horenia-ii', 
      nombre: 'HOVENIA II', 
      direccion: 'Mitre 1336 - Depto 4 D', 
      rentas: '240540492086',
      municipal: ['1', '1', '115', '47', '81']
    },
    { 
      id: 'egea-5', 
      nombre: 'EGEA 5', 
      direccion: 'Pringles 96 - Depto', 
      rentas: '240525667457',
      municipal: ['1', '2', '205', '7', '13']
    },
    { 
      id: 'robles-xiv-fabian', 
      nombre: 'ROBLES XIV', 
      direccion: 'Bs As 645 - Depto 4 C',
      direccion2: 'Bs As 645 - Depto 3 C', 
      rentas: '240527453471',
      rentas2: '240527453411',
      municipal: ['1', '1', '69', '5', '43'],
      municipal2: ['1', '1', '69', '5', '37'],
      esSegundoDepto: true
    },
    { 
      id: 'libertador-i', 
      nombre: 'LIBERTADOR I', 
      direccion: 'Pringles 242 - Depto 5 B'
    }
  ]

  // Función para obtener el depto completo
  const getDeptoCompleto = (id, persona) => {
    if (persona === 'yani') {
      return deptosYaniCompletos.find(d => d.id === id)
    } else {
      return deptosFabianCompletos.find(d => d.id === id)
    }
  }

  // Determinar qué departamentos mostrar según la categoría
  const deptosAMostrar = categoria === 'yani' ? deptosYani : deptosFabian
  const personaActual = categoria === 'yani' ? 'yani' : 'fabian'
  const tituloCategoria = categoria === 'yani' ? 'Yani' : 'Fabián'

  return (
    <div className="info-container">
      <h2 className="info-title">Departamentos de {tituloCategoria}</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>{tituloCategoria}</th>
          </tr>
        </thead>
        <tbody>
          {deptosAMostrar.map((depto) => (
            <tr key={depto.id}>
              <td>
                <Link
                  to={`/depto/${personaActual}/${depto.id}`}
                  state={getDeptoCompleto(depto.id, personaActual)}
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
        onClick={() => navigate('/seleccion-departamentos')}
      >
        Volver
      </button>
    </div>
  )
}

export default Departamentos