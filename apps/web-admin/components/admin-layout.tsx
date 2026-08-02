"use client"

import React, { createContext, memo, use } from "react"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarContent } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "./app-sidebar"
import TopbarPage from "./topbar"
import { trpc } from "@/app/trpc"
import { adminNavigation, NavItem } from "@/utils/navigation"
import LoadingSpinnerComponent from "./loading"


interface AdminLayoutProps {
  children: React.ReactNode
}

type UserRoleDto = "Admin" | "Sales" | "Viewer";

interface AdminLayoutContextProps {
  user: {
    userId: string;
    role: UserRoleDto;
  };
  refetchUser: () => void;
  isLoading: boolean;
}

export const AdminLayoutContext = createContext<AdminLayoutContextProps>({
  user: {
    userId: "",
    role: "" as UserRoleDto,
  },
  refetchUser: () => { },
  isLoading: false,
});

const AdminLayoutPage = memo(({ children }: AdminLayoutProps) => {

  const [mounted, setMounted] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([]);
  const [user, setUser] = useState<{
    userId: string;
    role: UserRoleDto;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: response,
    isLoading,
    refetch,
    isRefetching
  } = trpc.app.user.auth.getUserAuth.useQuery({
    refetchOnWindowFocus: true,
    keepPreviousData: false, // smooth page transition
  });

  const userInfo = response?.data as {
    userId: string;
    role: UserRoleDto;
  } | null;

  useEffect(() => {
    if (userInfo) {
      const { role } = userInfo;
      setUser(userInfo);
      const filteredNavigationItems = adminNavigation.filter((item) => {
        // Check if the item has a role property and if it includes the user's role
        if (item.role && item.role.includes(role)) {
          // If the item has children, filter them based on the user's role
          if (item.children && item.children.length > 0) {
            item.children = item.children.filter((child) => child.role && child.role.includes(role));
          }
          return true;
        }
        return false;
      });
      setNavigationItems(filteredNavigationItems);
    }
  }, [userInfo]);

  if (!mounted) {
    // Prevent hydration mismatch
    return null;
  }

  if (isLoading || isRefetching) {
    return <LoadingSpinnerComponent />
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar navigationItems={navigationItems} />
        <AdminLayoutContext.Provider value={{ user: user || { userId: "", role: "" as UserRoleDto }, refetchUser: refetch, isLoading }}>
          <SidebarContent>
            <main>
              <TopbarPage />
              <div className="p-4">
                {children}
              </div>
            </main>
          </SidebarContent>
        </AdminLayoutContext.Provider>
      </SidebarProvider>
    </>
  )
})


export default AdminLayoutPage;