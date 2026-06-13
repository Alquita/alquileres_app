let ctx = null
let pendientes = []
let inicializado = false

function tocar() {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 800
  gain.gain.value = 0.3
  osc.start()
  setTimeout(() => osc.stop(), 200)
}

export function reproducirSonido() {
  try {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctx.state === 'suspended') {
      pendientes.push(tocar)
      if (!inicializado) {
        inicializado = true
        const handler = () => {
          ctx.resume().then(() => {
            pendientes.forEach(fn => fn())
            pendientes = []
          })
          document.removeEventListener('click', handler)
          document.removeEventListener('touchstart', handler)
        }
        document.addEventListener('click', handler)
        document.addEventListener('touchstart', handler)
      }
    } else {
      tocar()
    }
  } catch (e) {}
}
