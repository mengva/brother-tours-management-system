import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@workspace/ui/components/sidebar"
import SidebarPage from "./sidebar"
import type { NavItem } from "@/utils/navigation"

export function AppSidebar({ navigationItems }: { navigationItems: NavItem[] }) {
    return (
        <Sidebar>
            {/* <SidebarHeader /> */}
            <SidebarContent>
                <SidebarPage navigationItems={navigationItems} />
            </SidebarContent>
            {/* <SidebarFooter /> */}
        </Sidebar>
    )
}