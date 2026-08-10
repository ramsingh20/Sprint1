import AppSidebar from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
            <main className="min-h-svh bg-background text-foreground transition-colors duration-300">
                <Outlet />
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout