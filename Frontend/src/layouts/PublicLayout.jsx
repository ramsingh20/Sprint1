import Footer from '@/components/Footer'
import SimpleNavbar from '@/components/SimpleNavbar'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <>
      <div
        className="
          min-h-screen
          bg-gray-100
          text-gray-900
          dark:bg-slate-950
          dark:text-white
          transition-colors
          duration-300
          flex
          flex-col
        "
      >
        <SimpleNavbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  )
}

export default PublicLayout