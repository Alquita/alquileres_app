import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loadProperty } from '../services/syncService'
import { reproducirSonido } from '../utils/sonido'

const propiedades = [
  { tipo: 'departamentos', propietario: 'yani', id: 'puertas-del-sol', nombre: 'Puertas del Sol 2' },
  { tipo: 'departamentos', propietario: 'yani', id: 'robles-viii', nombre: 'Robles VIII' },
  { tipo: 'departamentos', propietario: 'yani', id: 'mares-iii', nombre: 'Mares III' },
  { tipo: 'departamentos', propietario: 'yani', id: 'cielos-i', nombre: 'Cielos I' },
  { tipo: 'departamentos', propietario: 'yani', id: 'robles-xiv', nombre: 'Robles XIV' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'jeremias', nombre: 'Jeremias' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'marconi', nombre: 'Marconi' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'horenia-ii', nombre: 'Hovenia II' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'egea-5', nombre: 'Egea 5' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'robles-xiv-fabian', nombre: 'Robles XIV (F)' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'libertador-i', nombre: 'Libertador I' },
  { tipo: 'casas', propietario: 'yani', id: 'ochoa', nombre: 'Ochoa' },
  { tipo: 'casas', propietario: 'fabian', id: 'ARGUELLO', nombre: 'Arguello' },
  { tipo: 'casas', propietario: 'fabian', id: 'FLORENTIN', nombre: 'Florentin' },
  { tipo: 'casas', propietario: 'fabian', id: 'FALCO', nombre: 'Falco' },
  { tipo: 'casas', propietario: 'fabian', id: 'SUPAGA', nombre: 'Supaga' }
]

const subTablas = [
  { tipo: 'departamentos', propietario: 'yani', id: 'puertas-del-sol', sufijo: 'cochera', nombre: 'Cochera 24 (Puertas del Sol)' },
  { tipo: 'departamentos', propietario: 'fabian', id: 'robles-xiv-fabian', sufijo: 'depto3c', nombre: 'Depto 3C (Robles XIV)' }
]

function ContratoChecker() {
  const notificados = useRef(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    async function verificar() {
      const uniqueIds = [...new Set([
        ...propiedades.map(p => JSON.stringify({ tipo: p.tipo, propietario: p.propietario, id: p.id })),
        ...subTablas.map(p => JSON.stringify({ tipo: p.tipo, propietario: p.propietario, id: p.id }))
      ])].map(s => JSON.parse(s))

      const results = await Promise.all(
        uniqueIds.map(p => loadProperty(p.tipo, p.propietario, p.id))
      )

      const dataPorId = {}
      uniqueIds.forEach((p, i) => {
        dataPorId[p.id] = results[i]
      })

      const revisar = (id, sufijo, label, tipo, propietario) => {
        const data = dataPorId[id]
        if (!data) return
        const key = sufijo ? `${id}-${sufijo}` : id
        if (notificados.current.has(key)) return

        const fechaKey = sufijo ? `contrato_ultima_actualizacion_${sufijo}` : 'contrato_ultima_actualizacion'
        const periodoKey = sufijo ? `contrato_periodo_${sufijo}` : 'contrato_periodo'

        const ultima = data[fechaKey]
        const periodo = data[periodoKey]
        if (!ultima || !periodo) return

        const ultimaDate = new Date(ultima)
        const venc = new Date(ultimaDate)
        venc.setMonth(venc.getMonth() + periodo)

        if (new Date() > venc) {
          notificados.current.add(key)
          reproducirSonido()
          toast(
            <span
              onClick={() => navigate(`/alquileres/${tipo}/${propietario}/${id}`)}
              style={{ cursor: 'pointer', display: 'block' }}
            >
              ⚠️ {label} necesita actualización (venció el {venc.toLocaleDateString('es-AR')})
            </span>,
            { duration: 10000 }
          )
        }
      }

      for (const p of propiedades) {
        revisar(p.id, null, p.nombre, p.tipo, p.propietario)
      }
      for (const t of subTablas) {
        revisar(t.id, t.sufijo, t.nombre, t.tipo, t.propietario)
      }
    }

    verificar()
  }, [])

  return null
}

export default ContratoChecker
