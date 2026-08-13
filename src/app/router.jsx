import DashboardLayout from '@/layouts/DashboardLayout'
import PublicLayout from '@/layouts/PublicLayout'
import  Analytics from '@/pages/Analytics'
import Dashboard from '@/pages/Dashboard'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
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
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
        </Route>

        <Route path='*' element={<NotFound />} />

    </Routes>
  )
}

export default Router