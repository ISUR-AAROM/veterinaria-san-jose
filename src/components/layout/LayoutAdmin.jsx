import { Outlet } from 'react-router-dom'
import { SidebarAdmin } from './SidebarAdmin'

export function LayoutAdmin() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <SidebarAdmin />
      <main className="ml-60 px-8 py-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
