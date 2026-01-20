import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <h1 className="home-title">
        Gestión de Alquileres
      </h1>

      <div className="home-buttons">
        <button
          className="btn btn-primary btn-lg px-5 py-3"
          onClick={() => navigate('/info')}
        >
          Info
        </button>

        <button
          className="btn btn-success btn-lg px-5 py-3"
          onClick={() => navigate('/alquileres')}
        >
          Alquileres
        </button>
      </div>
    </div>
  )
}

export default Home
