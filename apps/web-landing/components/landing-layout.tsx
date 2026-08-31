"use client"

import React, { createContext, memo } from "react"
import { useEffect, useState } from "react"
import AppBarPage from "./app-bar"
import FooterPage from "./footer"


interface LandingLayoutProps {
  children: React.ReactNode
}

const LandingLayoutPage = memo(({ children }: LandingLayoutProps) => {

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
      <main>
        <AppBarPage/>
        <div className="p-4">
          {children}
        </div>
        <FooterPage/>
      </main>
    </>
  )
})


export default LandingLayoutPage;