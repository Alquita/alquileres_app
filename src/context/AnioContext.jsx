import { createContext, useContext, useState, useEffect } from 'react'
import { ANIO_MINIMO } from '../services/syncService'

const CLAVE_SESSION = 'anioSeleccionado'

const AnioContext = createContext(null)

// Solo la preferencia de UI (año elegido) vive en sessionStorage
function leerAnioGuardado() {
  try {
    const valor = parseInt(sessionStorage.getItem(CLAVE_SESSION), 10)
    if (Number.isInteger(valor) && valor >= ANIO_MINIMO) return valor
  } catch {
    // sessionStorage no disponible, seguimos con el año actual
  }
  // Valor inválido o menor al mínimo: año actual (nunca antes de 2026)
  return Math.max(ANIO_MINIMO, new Date().getFullYear())
}

export function AnioProvider({ children }) {
  const [anioSeleccionado, setAnioSeleccionado] = useState(leerAnioGuardado)

  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE_SESSION, String(anioSeleccionado))
    } catch {
      // sin sessionStorage no se persiste, no pasa nada
    }
  }, [anioSeleccionado])

  return (
    <AnioContext.Provider value={{ anioSeleccionado, setAnioSeleccionado }}>
      {children}
    </AnioContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnio() {
  const ctx = useContext(AnioContext)
  if (!ctx) throw new Error('useAnio tiene que usarse dentro de <AnioProvider>')
  return ctx
}
