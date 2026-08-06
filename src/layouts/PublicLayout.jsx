import Footer from '@/components/Footer'
import SimpleNavbar from '@/components/SimpleNavbar'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <BrowserRouter>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default PublicLayout