"use client"

import React, { createContext, memo } from "react"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarContent } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "./app-sidebar"
import TopbarPage from "./topbar"


interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayoutPage = memo(({ children }: AdminLayoutProps) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch
    return null;
  }
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarContent>
          <main>
            <TopbarPage />
            <div className="p-4">
              {children}
            </div>
          </main>
        </SidebarContent>
      </SidebarProvider>
    </>
  )
})


export default AdminLayoutPage;