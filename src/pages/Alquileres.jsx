import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Alquileres() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirige automáticamente a la selección
    navigate('/alquileres/seleccion')
  }, [navigate])

  return null
}

export default Alquileres