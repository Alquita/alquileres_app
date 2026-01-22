import { Link, useNavigate } from 'react-router-dom'

function Info() {
  const navigate = useNavigate()

  const deptosYani = [
    { 
      id: 'local', 
      nombre: 'LOCAL', 
      direccion: 'Buenos Aires 660', 
      rentas: '240522467384',
      municipal: ['1', '2', '163', '25', '9']
    },
    { 
      id: 'casa', 
      nombre: 'CASA', 
      direccion: 'Psje 12 de Octubre 1248', 
      rentas: '240517589161',
      municipal: ['03', '01', '208', '17', '00']
    },
    { 
      id: 'puertas-del-sol', 
      nombre: 'PUERTAS DEL SOL 2', 
      direccion: 'Yrigoyen 1235 - Depto 10 F', 
      direccion2: 'Cochera 24', 
      rentas: '240543828905', 
      rentas2: '240543827941',
      municipal: ['1', '2', '188', '100', '24'],
      municipal2: ['1', '1', '69', '5', '42']
    },
    { 
      id: 'casa-desantes', 
      nombre: 'CASA REARTES', 
      direccion: 'Reartes', 
      rentas: '120190140683'
    },
    { 
      id: 'robles-viii', 
      nombre: 'ROBLES VIII', 
      direccion: 'Alberdi 1037 - Depto 1 A', 
      rentas: '240525517650',
      municipal: ['1', '1', '60', '3', '14']
    },
    { 
      id: 'autos', 
      nombre: 'AUTOS',
      patentes: ['OZP 523', 'AB 985 HB', 'AH 049 WB']
    },
    { 
      id: 'mares-iii', 
      nombre: 'MARES III', 
      direccion: 'Baigorria 609 - Depto B 3', 
      rentas: '240542182441',
      municipal: ['1', '1', '5', '9', '19']
    },
    { 
      id: 'fua', 
      nombre: 'FARMACIA', 
      direccion: 'Comercio e Industria - NUM RIO IV',
      municipal: ['S-2890']
    },
    { 
      id: 'cielos-i', 
      nombre: 'CIELOS I', 
      direccion: 'San Martín 465 - Depto 3 A', 
      rentas: '240527342920',
      municipal: ['1', '2', '205', '7', '13']
    },
    { 
      id: 'robles-xiv', 
      nombre: 'ROBLES XIV', 
      direccion: 'Buenos Aires 645 - Depto 4 A', 
      direccion2: 'Cochera', 
      rentas: '240527453462', 
      rentas2: '240527453209',
      municipal: ['1', '1', '58', '24', '11'],
      municipal2: ['1', '1', '69', '5', '16']
    },
    { 
      id: 'campo', 
      nombre: 'CAMPO', 
      direccion: '40 HAS 1',
      direccion2: '40 HAS 2',
      direccion3: '49 HAS',
      rentas: '240602995720', 
      rentas2: '240602995756',
      rentas3: '240644408354'
    },
    { 
      id: 'casa-mama', 
      nombre: 'CASA MAMA', 
      rentas: '240604807868'
    },
    { 
      id: 'casa-jardin', 
      nombre: 'CASA JARDIN', 
      rentas: '240621578996'
    }
  ]

  const deptosFabian = [
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
      rentas: '240525867457',
      municipal: ['1', '2', '205', '7', '13']
    },
    { 
      id: 'robles-xiv-fabian', 
      nombre: 'ROBLES XIV', 
      direccion: 'Bs As 645 - Depto 4 C',
      direccion2: 'Bs As 645 - Depto 3 C', 
      rentas: '240527453441',
      rentas2: '240527453471',
      municipal: ['1', '1', '69', '5', '43'],
      municipal2: ['1', '1', '69', '5', '37'],
      esSegundoDepto: true // Indica que la segunda fila es otro depto, no cochera
    },
    { 
      id: 'libertador-i', 
      nombre: 'LIBERTADOR I', 
      direccion: 'Pringles 242 - Depto 5 B'
    },
    { 
      id: 'campo-fabian', 
      nombre: 'CAMPO', 
      rentas: '240604843082'
    },
    { 
      id: 'casa-tros', 
      nombre: 'CASA TIOS', 
      rentas: '240644274650'
    }
  ]

  const deptosCompartidos = [
    {
      id: 'quinta-lindante-con-feria',
      nombre: 'QUINTA LINDANTE CON FERIA',
      direccion: 'Quinta Lindante con Feria',
      rentas: '240642836669'
    },
    {
      id: '5-has-a',
      nombre: '5 HAS A',
      direccion: '5 HAS A',
      rentas: '240640049392'
    },
    {
      id: '5-has-b',
      nombre: '5 HAS B',
      direccion: '5 HAS B',
      rentas: '240603752741'
    },
    {
      id: '5-has-c',
      nombre: '5 HAS C',
      direccion: '5 HAS C',
      rentas: '240640049406'
    },
    {
      id: 'ruta-24-publica',
      nombre: 'RUTA 24 PUBLICA',
      direccion: 'Ruta 24 Publica',
      rentas: '240625512141'
    },
    {
      id: 'ruta-24-sabattini',
      nombre: 'RUTA 24 SABATTINI',
      direccion: 'Ruta 24 Sabattini',
      rentas: '240625512132'
    },
    {
      id: 'terreno-p-coego-pellegrini',
      nombre: 'TERRENO P. COEGO Y PELLEGRINI',
      direccion: 'Terreno P. Coego y Pellegrini',
      rentas: '240644274644'
    }
  ]

  const maxLength = Math.max(deptosYani.length, deptosFabian.length, deptosCompartidos.length)

  return (
    <div className="info-container">
      <h2 className="info-title">Información de Departamentos</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>Yani</th>
            <th>Yani y Fabián</th>
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
                {deptosCompartidos[index] ? (
                  <Link
                    to={`/info/compartido/${deptosCompartidos[index].id}`}
                    state={deptosCompartidos[index]}
                    className="info-link"
                  >
                    {deptosCompartidos[index].nombre}
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