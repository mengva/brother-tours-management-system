"use client"

import React, { createContext, memo, use } from "react"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarContent } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "./app-sidebar"
import TopbarPage from "./topbar"
import { trpc } from "@/app/trpc"
import { adminNavigation, type NavItem } from "@/utils/navigation"
import LoadingSpinnerComponent from "./loading"
import NotFound from "@/app/not-found"
import { usePathname } from "next/navigation"

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

  const path = usePathname();
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

  const handleFilterNavigationItems = (userRole: UserRoleDto) => {
    const filteredNavigationItems = adminNavigation.filter((item) => {
      // Check if the item has a role property and if it includes the user's role
      if (item.role && item.role.includes(userRole)) {
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter((child) => child.role && child.role.includes(userRole));
        }
        return true;
      }
      return false;
    });
    return filteredNavigationItems;
  };

  useEffect(() => {
    if (userInfo) {
      const { role } = userInfo;
      setUser(userInfo);

      const filteredNavigationItems = handleFilterNavigationItems(role);

      setNavigationItems(filteredNavigationItems);
    }
  }, [userInfo]);

  const handleCheckUserPermission = (navigations: NavItem[]) => {
    return navigations.some(nav => {
      if (nav.children.length > 0) {
        return nav.children.some(child => path.startsWith(child.href));
      }
      return path.startsWith(nav.href);
    });
  }

  if (user && user.role) {
    const isRoute = handleCheckUserPermission(navigationItems);
    if (!isRoute) {
      return <NotFound />
    }
  }

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