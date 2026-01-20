import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Info from './pages/Info'
import Alquileres from './pages/Alquileres'
import InfoDepto from './pages/InfoDepto'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/info/:persona/:id" element={<InfoDepto />} />
        <Route path="/alquileres" element={<Alquileres />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
