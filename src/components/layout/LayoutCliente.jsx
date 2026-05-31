import { Outlet } from 'react-router-dom'
import { NavbarCliente } from './NavbarCliente'

export function LayoutCliente() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarCliente />
      <main className="flex-1 pt-16 max-w-5xl mx-auto px-8 py-6 w-full">
        <Outlet />
      </main>
    </div>
  )
}
