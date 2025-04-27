import { User, Pencil, Trophy, Mail, Settings } from "lucide-react"

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
        url: "/profile",
        icon: User,
    },
    {
        title: "Éditer le profil",
        url: "/profile/edit",
        icon: Pencil,
    },
    {
        title: "Mes parties",
        url: "/mygames",
        icon: Trophy,
    },
    {
        title: "Mes invitations",
        url: "/invitations",
        icon: Mail,
    },
    {
        title: "Paramètres",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
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
            </SidebarContent>
        </Sidebar>
    )
}