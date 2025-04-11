"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ClientExemple } from "./_components/client-exemple";

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Server Side Session</h1>
            <pre className="bg-white p-4 rounded shadow-md">
                {JSON.stringify(session, null, 2)}
            </pre>
            <h1 className="text-3xl font-bold mb-4">Client Side Session</h1>
            <ClientExemple />
        </div>
    );
}