import { useState } from 'react'

export default function MigrateButton({ onMigrate, label = 'Subir a la nube', style = {} }) {
  const [migrando, setMigrando] = useState(false)
  const [hecho, setHecho] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = async () => {
    setMigrando(true)
    setError(null)
    try {
      const result = await onMigrate()
      if (result) {
        setHecho(true)
        setTimeout(() => setHecho(false), 3000)
      } else {
        setError('No hay datos para migrar')
      }
    } catch (e) {
      setError('Error al migrar: ' + e.message)
    } finally {
      setMigrando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', ...style }}>
      <button
        className="btn btn-sm"
        onClick={handleClick}
        disabled={migrando}
        style={{
          background: hecho
            ? 'linear-gradient(135deg, #198754, #146c43)'
            : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '0.5rem 1.5rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: migrando ? 'wait' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: migrando ? 0.7 : 1
        }}
      >
        {migrando ? 'Subiendo...' : hecho ? '✓ Subido' : `☁️ ${label}`}
      </button>
      {error && (
        <small style={{ color: '#dc3545', fontWeight: 500 }}>{error}</small>
      )}
    </div>
  )
}
