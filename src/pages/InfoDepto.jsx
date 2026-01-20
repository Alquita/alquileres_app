import { useParams, useLocation, useNavigate } from 'react-router-dom'

function InfoDepto() {
  const { persona, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const depto = location.state

  return (
    <div className="depto-container">
      <h2 className="depto-title">
        {persona.toUpperCase()} – {depto?.nombre || 'Departamento'}
      </h2>

      <div className="depto-info-grid">
        <div className="depto-info-card">
          <h3 className="depto-info-label">Dirección</h3>
          <p className="depto-info-value">{depto?.direccion || 'No especificada'}</p>
        </div>

        <div className="depto-info-card">
          <h3 className="depto-info-label">Número de Renta</h3>
          <p className="depto-info-value">{depto?.rentas || 'No especificado'}</p>
        </div>

        {/* Solo mostrar si existe direccion2 */}
        {depto?.direccion2 && (
          <div className="depto-info-card">
            <h3 className="depto-info-label">Dirección Cochera</h3>
            <p className="depto-info-value">{depto.direccion2}</p>
          </div>
        )}
        
        {/* Solo mostrar si existe rentas2 */}
        {depto?.rentas2 && (
          <div className="depto-info-card">
            <h3 className="depto-info-label">Número de Renta Cochera</h3>
            <p className="depto-info-value">{depto.rentas2}</p>
          </div>
        )}
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate('/info')}
      >
        Volver
      </button>
    </div>
  )
}

export default InfoDepto