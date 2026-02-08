import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function InfoDepto() {
  const { persona, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const depto = location.state
  const [copiedRenta, setCopiedRenta] = useState(null)
  const [copiedMunicipal, setCopiedMunicipal] = useState(null)
  const [copiedPatente, setCopiedPatente] = useState(null)

  // Detectar de qué página viene para saber a dónde volver
  const vieneDeInfo = location.pathname.includes('/info/')
  const vieneDeDepto = location.pathname.includes('/depto/')

  const handleVolver = () => {
    if (vieneDeDepto) {
      navigate(`/departamentos/${persona}`)
    } else {
      navigate('/info')
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedRenta(id)
    setTimeout(() => setCopiedRenta(null), 2000)
  }

  const copyMunicipalDigit = (digit, id) => {
    navigator.clipboard.writeText(digit)
    setCopiedMunicipal(id)
    setTimeout(() => setCopiedMunicipal(null), 2000)
  }

  const copyPatente = (patente, id) => {
    navigator.clipboard.writeText(patente)
    setCopiedPatente(id)
    setTimeout(() => setCopiedPatente(null), 2000)
  }

  const RentaCard = ({ renta, label, rentaNum }) => (
    <div className="depto-info-card">
      <h3 className="depto-info-label">{label}</h3>
      <div className="renta-container">
        <a 
          href="https://www.rentascordoba.gob.ar/emision/ver-y-pagar/inmobiliario"
          target="_blank"
          rel="noopener noreferrer"
          className="renta-link"
        >
          {renta}
        </a>
        <button 
          className="copy-btn"
          onClick={() => copyToClipboard(renta, `renta-${rentaNum}`)}
          title="Copiar número"
        >
          {copiedRenta === `renta-${rentaNum}` ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  )

  const MunicipalCard = ({ municipal, label, municipalNum }) => {
    const isFarmacia = municipal.length === 1 && municipal[0].startsWith('S-')
    
    if (isFarmacia) {
      const fullCode = municipal[0]
      const letra = fullCode.split('-')[0]
      const numero = fullCode.split('-')[1]
      
      return (
        <div className="depto-info-card municipal-card">
          <h3 className="depto-info-label">{label}</h3>
          
          <div className="municipal-links">
            <a 
              href="https://app.riocuarto.gov.ar:8443/gestiontributaria/servlet/com.recursos.hceduimpmul?Come"
              target="_blank"
              rel="noopener noreferrer"
              className="municipal-link-btn"
            >
              Comercio
            </a>
            <a 
              href="https://emosvirtual.riocuarto.gov.ar:9090/emosweb/servlet/com.emosweb.login"
              target="_blank"
              rel="noopener noreferrer"
              className="municipal-link-btn"
            >
              EMOS
            </a>
          </div>

          <div className="municipal-digits farmacia-digits">
            <div className="digit-container">
              <span className="digit-value">{letra}</span>
              <button 
                className="copy-digit-btn"
                onClick={() => copyMunicipalDigit(letra, `farmacia-letra`)}
                title={`Copiar ${letra}`}
              >
                {copiedMunicipal === `farmacia-letra` ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
            
            <span className="digit-separator">-</span>
            
            <div className="digit-container">
              <span className="digit-value">{numero}</span>
              <button 
                className="copy-digit-btn"
                onClick={() => copyMunicipalDigit(numero, `farmacia-numero`)}
                title={`Copiar ${numero}`}
              >
                {copiedMunicipal === `farmacia-numero` ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="depto-info-card municipal-card">
        <h3 className="depto-info-label">{label}</h3>
        
        <div className="municipal-links">
          <a 
            href="https://app.riocuarto.gov.ar:8443/gestiontributaria/servlet/com.recursos.hceduimpmul?Inmo"
            target="_blank"
            rel="noopener noreferrer"
            className="municipal-link-btn"
          >
            Inmobiliario
          </a>
          <a 
            href="https://emosvirtual.riocuarto.gov.ar:9090/emosweb/servlet/com.emosweb.login"
            target="_blank"
            rel="noopener noreferrer"
            className="municipal-link-btn"
          >
            EMOS
          </a>
        </div>

        <div className="municipal-digits">
          {municipal.map((digit, index) => (
            <div key={index} className="digit-container">
              <span className="digit-value">{digit}</span>
              <button 
                className="copy-digit-btn"
                onClick={() => copyMunicipalDigit(digit, `${municipalNum}-${index}`)}
                title={`Copiar ${digit}`}
              >
                {copiedMunicipal === `${municipalNum}-${index}` ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const PatentesCard = ({ patentes, label }) => (
    <div className="depto-info-card patentes-card">
      <h3 className="depto-info-label">{label}</h3>
      
      <div className="patentes-list">
        {patentes.map((patente, index) => {
          // Determinar el link según la patente
          const isMoto = patente === 'A062ZEI'
          const linkUrl = isMoto 
            ? 'https://economiariocuarto.gob.ar/pagos-y-deudas'
            : 'https://www.rentascordoba.gob.ar/emision/ver-y-pagar/automotor'
          
          return (
            <div key={index} className="patente-item">
              <a 
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="patente-link"
              >
                {patente}
              </a>
              <button 
                className="copy-patente-btn"
                onClick={() => copyPatente(patente, `patente-${index}`)}
                title={`Copiar ${patente}`}
              >
                {copiedPatente === `patente-${index}` ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  const EcogasCard = ({ ecogas, label }) => {
    const [copiedEcogas, setCopiedEcogas] = useState(null)

    const copyEcogas = (numero) => {
      navigator.clipboard.writeText(numero)
      setCopiedEcogas('ecogas')
      setTimeout(() => setCopiedEcogas(null), 2000)
    }

    return (
      <div className="depto-info-card">
        <h3 className="depto-info-label">{label}</h3>
        <div className="renta-container">
          <a 
            href="https://autogestion.ecogas.com.ar/uiextranet/ingreso?s=p"
            target="_blank"
            rel="noopener noreferrer"
            className="renta-link"
          >
            {ecogas}
          </a>
          <button 
            className="copy-btn"
            onClick={() => copyEcogas(ecogas)}
            title="Copiar número"
          >
            {copiedEcogas === 'ecogas' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  }

  const EpecCard = ({ epec, label }) => {
    const [copiedEpec, setCopiedEpec] = useState(null)

    const copyEpecDigit = (digit, id) => {
      navigator.clipboard.writeText(digit)
      setCopiedEpec(id)
      setTimeout(() => setCopiedEpec(null), 2000)
    }

    const partes = epec.split('-').map(p => p.trim())

    return (
      <div className="depto-info-card">
        <h3 className="depto-info-label">{label}</h3>
        <div className="municipal-digits farmacia-digits">
          <div className="digit-container">
            <a 
              href="https://www.epec.com.ar/tramites/pagos"
              target="_blank"
              rel="noopener noreferrer"
              className="digit-value"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {partes[0]}
            </a>
            <button 
              className="copy-digit-btn"
              onClick={() => copyEpecDigit(partes[0], 'epec-1')}
              title={`Copiar ${partes[0]}`}
            >
              {copiedEpec === 'epec-1' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
          
          <span className="digit-separator">-</span>
          
          <div className="digit-container">
            <a 
              href="https://www.epec.com.ar/tramites/pagos"
              target="_blank"
              rel="noopener noreferrer"
              className="digit-value"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {partes[1]}
            </a>
            <button 
              className="copy-digit-btn"
              onClick={() => copyEpecDigit(partes[1], 'epec-2')}
              title={`Copiar ${partes[1]}`}
            >
              {copiedEpec === 'epec-2' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const CooperativaLuzCard = ({ numero, label }) => {
    const [copiedCoop, setCopiedCoop] = useState(null)

    const copyCoop = (num) => {
      navigator.clipboard.writeText(num)
      setCopiedCoop('coop')
      setTimeout(() => setCopiedCoop(null), 2000)
    }

    return (
      <div className="depto-info-card">
        <h3 className="depto-info-label">{label}</h3>
        <div className="renta-container">
          <a 
            href="https://facturas.cooplosreartes.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="renta-link"
          >
            {numero}
          </a>
          <button 
            className="copy-btn"
            onClick={() => copyCoop(numero)}
            title="Copiar número"
          >
            {copiedCoop === 'coop' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  }

  const ComunaAguaCard = ({ numero, label }) => {
    const [copiedComuna, setCopiedComuna] = useState(null)

    const copyComuna = (num) => {
      navigator.clipboard.writeText(num)
      setCopiedComuna('comuna')
      setTimeout(() => setCopiedComuna(null), 2000)
    }

    return (
      <div className="depto-info-card">
        <h3 className="depto-info-label">{label}</h3>
        <div className="renta-container">
          <a 
            href="https://www.municipalidad.com/lrea/deuda"
            target="_blank"
            rel="noopener noreferrer"
            className="renta-link"
          >
            {numero}
          </a>
          <button 
            className="copy-btn"
            onClick={() => copyComuna(numero)}
            title="Copiar número"
          >
            {copiedComuna === 'comuna' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="depto-container">
      <h2 className="depto-title">
        {persona.toUpperCase()} – {depto?.nombre || 'Departamento'}
      </h2>

      <div className="depto-info-grid">
        {/* Primera fila */}
        <div className="depto-row">
          {depto?.direccion && (
            <div className="depto-info-card">
              <h3 className="depto-info-label">Dirección</h3>
              <p className="depto-info-value">{depto.direccion}</p>
            </div>
          )}

          {depto?.rentas && (
            <RentaCard 
              renta={depto.rentas} 
              label="Número de Renta" 
              rentaNum={1}
            />
          )}

          {depto?.municipal && (
            <MunicipalCard 
              municipal={depto.municipal}
              label="Municipal"
              municipalNum="1"
            />
          )}

          {depto?.patentes && (
            <PatentesCard 
              patentes={depto.patentes}
              label="Patentes"
            />
          )}

          {depto?.ecogas && (
            <EcogasCard 
              ecogas={depto.ecogas}
              label="Ecogas"
            />
          )}

          {depto?.epec && (
            <EpecCard 
              epec={depto.epec}
              label="EPEC"
            />
          )}

          {depto?.cooperativaLuz && (
            <CooperativaLuzCard 
              numero={depto.cooperativaLuz}
              label="Cooperativa de Luz"
            />
          )}

          {depto?.comunaAgua && (
            <ComunaAguaCard 
              numero={depto.comunaAgua}
              label="Comuna Agua y Tasa"
            />
          )}
        </div>

        {/* Segunda fila */}
        {(depto?.direccion2 || depto?.rentas2 || depto?.municipal2) && (
          <div className="depto-row">
            {depto?.direccion2 && (
              <div className="depto-info-card">
                <h3 className="depto-info-label">
                  {depto?.direccion3 ? 'Dirección 2' : (depto?.esSegundoDepto ? 'Dirección 2' : 'Dirección Cochera')}
                </h3>
                <p className="depto-info-value">{depto.direccion2}</p>
              </div>
            )}
            
            {depto?.rentas2 && (
              <RentaCard 
                renta={depto.rentas2} 
                label={depto?.rentas3 ? 'Número de Renta 2' : (depto?.esSegundoDepto ? 'Número de Renta 2' : 'Número de Renta Cochera')}
                rentaNum={2}
              />
            )}

            {depto?.municipal2 && (
              <MunicipalCard 
                municipal={depto.municipal2}
                label={depto?.municipal3 ? 'Municipal 2' : (depto?.esSegundoDepto ? 'Municipal 2' : 'Municipal Cochera')}
                municipalNum="2"
              />
            )}
          </div>
        )}

        {/* Tercera fila (para Campo) */}
        {(depto?.direccion3 || depto?.rentas3) && (
          <div className="depto-row">
            {depto?.direccion3 && (
              <div className="depto-info-card">
                <h3 className="depto-info-label">Dirección 3</h3>
                <p className="depto-info-value">{depto.direccion3}</p>
              </div>
            )}
            
            {depto?.rentas3 && (
              <RentaCard 
                renta={depto.rentas3} 
                label="Número de Renta 3"
                rentaNum={3}
              />
            )}
          </div>
        )}
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={handleVolver}
      >
        Volver
      </button>
    </div>
  )
}

export default InfoDepto