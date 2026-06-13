import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

function PwaUpdater() {
  const intervaloRef = useRef(null)

  useEffect(() => {
    let updateSW = null

    async function init() {
      try {
        const mod = await import('virtual:pwa-register')
        const registerSW = mod.registerSW

        updateSW = registerSW({
          onNeedRefresh() {
            toast.success('🔄 Nueva versión disponible, actualizando...', { duration: Infinity })
            setTimeout(() => {
              updateSW(true)
              window.location.reload()
            }, 2000)
          },
          onOfflineReady() {},
        })

        intervaloRef.current = setInterval(() => {
          if (updateSW) updateSW()
        }, 60000)
      } catch {
        // virtual:pwa-register no disponible (modo dev sin build)
      }
    }

    init()

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current)
    }
  }, [])

  return null
}

export default PwaUpdater
