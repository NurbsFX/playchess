import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (session) {
        return redirect("/");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {children}
            </div>
        </div>
    )
}