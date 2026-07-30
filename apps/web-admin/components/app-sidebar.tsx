import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@workspace/ui/components/sidebar"
import SidebarPage from "./sidebar"

export function AppSidebar() {
    return (
        <Sidebar>
            {/* <SidebarHeader /> */}
            <SidebarContent>
                <SidebarPage />
            </SidebarContent>
            {/* <SidebarFooter /> */}
        </Sidebar>
    )
}