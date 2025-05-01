import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export default async function AuthLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return redirect("/");
    }

    return (
        <div >
            <main className="mt-[var(--navbar-height)] h-screen w-full">
                {children}
                <Toaster />
            </main>
        </div>
    )
}