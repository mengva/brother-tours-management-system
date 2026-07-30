"use client"

import React, { memo } from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import AdminLayoutPage from "./admin-layout"

interface UserAuthLayoutProps {
    children: React.ReactNode
}

const UserAuthLayoutPage = memo(({ children }: UserAuthLayoutProps) => {

    const pathname = usePathname();

    const [isAuth, setIsAuth] = useState(false)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const auth = pathname.startsWith("/auth");
        setIsAuth(auth);
    }, [pathname]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Prevent hydration mismatch
        return null;
    }

    return (
        <>
            {
                isAuth ? (
                    <main className="p-4">
                        {children}
                    </main>
                ) : <AdminLayoutPage>
                    {children}
                </AdminLayoutPage>

            }
        </>
    )
})


export default UserAuthLayoutPage;