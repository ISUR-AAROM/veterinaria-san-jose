import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { SessionProvider } from './context/SessionContext'

export default function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  )
}
