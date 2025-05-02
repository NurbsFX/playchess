import { User, Trophy, UserCog } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Profil Menu items.
const profileItems = [
    {
        title: "Mon profil",
        url: "/account/myprofile",
        icon: User,
    },
    {
        title: "Mes parties",
        url: "/mygames",
        icon: Trophy,
    },
]
// Profil Menu items.
const paramsItems = [
    {
        title: "Mon compte",
        url: "/account/myaccount",
        icon: UserCog,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="none" className="h-screen">
            <SidebarContent className="mt-[var(--navbar-height)] ml-4">
                <SidebarGroup>
                    <SidebarGroupLabel>Profil</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {profileItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Paramètres</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {paramsItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}