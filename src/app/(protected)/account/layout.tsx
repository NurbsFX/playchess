import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex items-center justify-center p-6 h-screen w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}
