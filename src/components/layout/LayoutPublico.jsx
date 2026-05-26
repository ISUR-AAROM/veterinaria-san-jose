import { Outlet } from 'react-router-dom'
import { NavbarPublico } from './NavbarPublico'
import { Footer } from './Footer'

export function LayoutPublico() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarPublico />
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
