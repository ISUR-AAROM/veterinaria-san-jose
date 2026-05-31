import { NavbarPublico } from '../../components/layout/NavbarPublico'
import { Footer } from '../../components/layout/Footer'
import { AdminLoginForm } from '../../components/auth/AdminLoginForm'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <NavbarPublico />
      <main className="flex-1 flex items-center justify-center pt-16">
        <AdminLoginForm />
      </main>
      <Footer />
    </div>
  )
}
