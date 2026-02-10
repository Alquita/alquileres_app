import { Link, useNavigate } from 'react-router-dom'

function Info() {
  const navigate = useNavigate()

  // Solo casas y propiedades especiales (SIN departamentos)
  const propiedadesYani = [
    { 
      id: 'local', 
      nombre: 'LOCAL', 
      direccion: 'Buenos Aires 660', 
      rentas: '240522467384',
      municipal: ['1', '1', '58', '24', '1']
    },
    { 
      id: 'casa', 
      nombre: 'CASA', 
      direccion: 'Psje 12 de Octubre 1248', 
      rentas: '240517589161',
      municipal: ['03', '01', '208', '11', '00'],
      ecogas: '22051944',
      epec: '1598382 - 0025288303'
    },
    { 
      id: 'casa-desantes', 
      nombre: 'CASA REARTES', 
      direccion: 'Reartes', 
      rentas: '120130140683',
      cooperativaLuz: '0610804E',
      comunaAgua: '16126'
    },
    { 
      id: 'autos', 
      nombre: 'AUTOS Y MOTO',
      patentes: ['OZP 523', 'AB 985 HB', 'AH 041 WB', 'A062ZEI']
    },
    { 
      id: 'fua', 
      nombre: 'FARMACIA', 
      direccion: 'Buenos Aires 660',
      telefonoFijo: '3584628212',
      municipal: ['S-2890'],
      ecogas: '21249909',
      epec: '01520789 - 0024517105'
    },
    { 
      id: 'campo', 
      nombre: 'CAMPO', 
      direccion: '40 HAS 1',
      direccion2: '40 HAS 2',
      direccion3: '49 HAS',
      rentas: '240602995730', 
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
    },
    {
      id: 'depto-vm',
      nombre: 'DEPTO VILLA MARIA',
      ecogas: '22352757',
      epec: '1598382 - 0289089206'
    }
  ]

  // Solo casas de Fabián
  const propiedadesFabian = [
    { 
      id: 'campo-fabian', 
      nombre: 'CAMPO', 
      direccion: '98 HAS',
      rentas: '240604843082'
    },
    { 
      id: 'casa-tros', 
      nombre: 'CASA TIOS', 
      rentas: '240644274650'
    }
  ]

  const propiedadesCompartidas = [
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
      nombre: 'RUTA 24 Y PUBLICA',
      direccion: 'Ruta 24 y Publica',
      rentas: '240625512141'
    },
    {
      id: 'ruta-24-sabattini',
      nombre: 'RUTA 24 Y SABATTINI',
      direccion: 'Ruta 24 y Sabattini',
      rentas: '240625512132'
    },
    {
      id: 'terreno-p-coego-pellegrini',
      nombre: 'TERRENO R. COEGO Y PELLEGRINI',
      direccion: 'Terreno R. Coego y Pellegrini',
      rentas: '240644274641'
    }
  ]

  const propiedadesVendidas = [
    {
      id: 'terreno-papa',
      nombre: 'TERRENO PAPA',
      rentas: '240619385561'
    },
    {
      id: 'jardin-1',
      nombre: 'JARDIN 1',
      rentas: '240621578856'
    },
    {
      id: 'jardin-2',
      nombre: 'JARDIN 2',
      rentas: '240621579003'
    }
  ]

  const maxLength = Math.max(
    propiedadesYani.length, 
    propiedadesFabian.length, 
    propiedadesCompartidas.length,
    propiedadesVendidas.length
  )

  return (
    <div className="info-container">
      <h2 className="info-title">Información de Propiedades</h2>

      <table className="table info-table text-center align-middle">
        <thead>
          <tr>
            <th>Yani</th>
            <th>Yani y Fabián</th>
            <th>Fabián</th>
            <th>Vendidos</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxLength }).map((_, index) => (
            <tr key={index}>
              <td>
                {propiedadesYani[index] ? (
                  <Link
                    to={`/info/yani/${propiedadesYani[index].id}`}
                    state={propiedadesYani[index]}
                    className="info-link"
                  >
                    {propiedadesYani[index].nombre}
                  </Link>
                ) : null}
              </td>
              <td>
                {propiedadesCompartidas[index] ? (
                  <Link
                    to={`/info/compartido/${propiedadesCompartidas[index].id}`}
                    state={propiedadesCompartidas[index]}
                    className="info-link"
                  >
                    {propiedadesCompartidas[index].nombre}
                  </Link>
                ) : null}
              </td>
              <td>
                {propiedadesFabian[index] ? (
                  <Link
                    to={`/info/fabian/${propiedadesFabian[index].id}`}
                    state={propiedadesFabian[index]}
                    className="info-link"
                  >
                    {propiedadesFabian[index].nombre}
                  </Link>
                ) : null}
              </td>
              <td>
                {propiedadesVendidas[index] ? (
                  <Link
                    to={`/info/vendido/${propiedadesVendidas[index].id}`}
                    state={propiedadesVendidas[index]}
                    className="info-link"
                  >
                    {propiedadesVendidas[index].nombre}
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