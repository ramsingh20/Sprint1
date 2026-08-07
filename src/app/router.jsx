import DashboardLayout from '@/layouts/DashboardLayout'
import PublicLayout from '@/layouts/PublicLayout'
import { Analytics } from '@/pages/Analytics'
import Dashboard from '@/pages/Dashboard'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import Users from '@/pages/Users'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const Router = () => {
  return (
    <Routes>

        {/* Website Layout */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Analytics />} />
            <Route path="orders" element={<Users />} />
            <Route path="customers" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings" element={<Profile />} />
        </Route>

    </Routes>
  )
}

export default Router