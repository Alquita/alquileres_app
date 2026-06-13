import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Info from './pages/Info'
import Alquileres from './pages/Alquileres'
import InfoDepto from './pages/InfoDepto'
import SeleccionDepartamentos from './pages/SeleccionDepartamentos'
import Departamentos from './pages/Departamentos'
import SeleccionAlquileres from './pages/SeleccionAlquileres'
import SeleccionPropietarioAlquiler from './pages/SeleccionPropietarioAlquiler'
import ListaAlquileres from './pages/ListaAlquileres'
import DetalleAlquiler from './pages/DetalleAlquiler'
import TotalMensual from './pages/TotalMensual'
import Campo from './pages/Campo'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 6000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/info/:persona/:id" element={<InfoDepto />} />
        <Route path="/alquileres" element={<Alquileres />} />
        <Route path="/seleccion-departamentos" element={<SeleccionDepartamentos />} />
        <Route path="/departamentos/:categoria" element={<Departamentos />} />
        <Route path="/depto/:persona/:id" element={<InfoDepto />} />
        <Route path="/alquileres" element={<Alquileres />} />
        <Route path="/alquileres/seleccion" element={<SeleccionAlquileres />} />
        <Route path="/alquileres/:tipo" element={<SeleccionPropietarioAlquiler />} />
        <Route path="/alquileres/:tipo/:propietario" element={<ListaAlquileres />} />
        <Route path="/alquileres/:tipo/:propietario/:id" element={<DetalleAlquiler />} />
        <Route path="/alquileres/total-mensual" element={<TotalMensual />} />
        <Route path="/alquileres/campo" element={<Campo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App