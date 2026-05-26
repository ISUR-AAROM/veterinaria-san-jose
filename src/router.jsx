import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

import { LayoutPublico } from './components/layout/LayoutPublico'
import { LayoutCliente } from './components/layout/LayoutCliente'
import { LayoutAdmin } from './components/layout/LayoutAdmin'
import { RutaCliente } from './components/layout/RutaCliente'
import { RutaAdmin } from './components/layout/RutaAdmin'
import { AdminProvider } from './context/AdminContext'

import { Landing } from './pages/publico/Landing'
import { Login } from './pages/publico/Login'
import { Registro } from './pages/publico/Registro'

import { MisMascotas } from './pages/cliente/MisMascotas'
import { NuevaMascota } from './pages/cliente/NuevaMascota'
import { MisCitas } from './pages/cliente/MisCitas'
import { NuevaCita } from './pages/cliente/NuevaCita'

import AdminLogin from './pages/admin/Login'
import { Agenda } from './pages/admin/Agenda'
import { Clientes } from './pages/admin/Clientes'
import { DetalleCliente } from './pages/admin/DetalleCliente'
import { DetalleCita } from './pages/admin/DetalleCita'
import { HistoriaClinica } from './pages/admin/HistoriaClinica'
import { Servicios } from './pages/admin/catalogos/Servicios'
import { Salas } from './pages/admin/catalogos/Salas'
import { Plantillas } from './pages/admin/catalogos/Plantillas'
import { Especies } from './pages/admin/catalogos/Especies'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPublico />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'registro', element: <Registro /> },
    ],
  },
  {
    path: '/cliente',
    element: <RutaCliente />,
    children: [
      {
        element: <LayoutCliente />,
        children: [
          { path: 'mascotas', element: <MisMascotas /> },
          { path: 'mascotas/nueva', element: <NuevaMascota /> },
          { path: 'citas', element: <MisCitas /> },
          { path: 'citas/nueva', element: <NuevaCita /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminProvider><Outlet /></AdminProvider>,
    children: [
      { path: 'login', element: <AdminLogin /> },
      {
        element: <RutaAdmin />,
        children: [
          {
            element: <LayoutAdmin />,
            children: [
              { index: true, element: <Navigate to="agenda" replace /> },
              { path: 'agenda', element: <Agenda /> },
              { path: 'clientes', element: <Clientes /> },
              { path: 'clientes/:id', element: <DetalleCliente /> },
              { path: 'citas/:id', element: <DetalleCita /> },
              { path: 'historia/:idMascota', element: <HistoriaClinica /> },
              { path: 'catalogos/servicios', element: <Servicios /> },
              { path: 'catalogos/salas', element: <Salas /> },
              { path: 'catalogos/plantillas', element: <Plantillas /> },
              { path: 'catalogos/especies', element: <Especies /> },
            ],
          },
        ],
      },
    ],
  },
])
