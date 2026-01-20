import { useParams, useNavigate } from 'react-router-dom'

function InfoDepto() {
  const { persona, id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="container mt-4">
      <h2>
        {persona.toUpperCase()} – Depto {id}
      </h2>

      <p className="mt-3">
        Acá va toda la información del departamento.
      </p>

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
