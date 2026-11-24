// Check de tres estados: – (ninguno) → ✓ (ok) → ✗ (no) → – ...
// Estilos inline a propósito: `.alquiler-page-container .btn` (style.css) pisa los colores de Bootstrap
const ESTADOS = {
  ninguno: { simbolo: '–', texto: 'sin marcar', siguiente: 'ok', colores: { backgroundColor: '#ffffff', color: '#6c757d', border: '2px solid #ced4da' } },
  ok: { simbolo: '✓', texto: 'tilde', siguiente: 'no', colores: { backgroundColor: '#198754', color: '#ffffff', border: '2px solid #198754' } },
  no: { simbolo: '✗', texto: 'cruz', siguiente: 'ninguno', colores: { backgroundColor: '#dc3545', color: '#ffffff', border: '2px solid #dc3545' } }
}

function CheckEstado({ valor, onChange, etiqueta }) {
  // Valor desconocido = sin marcar
  const estado = ESTADOS[valor] || ESTADOS.ninguno
  const descripcion = `${etiqueta}: ${estado.texto}. Tocá para cambiar`

  return (
    <button
      type="button"
      onClick={() => onChange(estado.siguiente)}
      aria-label={descripcion}
      title={descripcion}
      style={{
        ...estado.colores,
        minWidth: 44,
        minHeight: 44,
        padding: '0 0.75rem',
        borderRadius: 8,
        fontSize: '1.2rem',
        fontWeight: 700,
        lineHeight: 1,
        cursor: 'pointer'
      }}
    >
      {estado.simbolo}
    </button>
  )
}

export default CheckEstado
