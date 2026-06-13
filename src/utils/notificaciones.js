import toast from 'react-hot-toast'

const toastsActivos = {}

export function guardarToastId(clave, toastId) {
  toastsActivos[clave] = toastId
}

export function descartarToast(clave) {
  if (toastsActivos[clave]) {
    toast.dismiss(toastsActivos[clave])
    delete toastsActivos[clave]
  }
}
