"use client"

import { authClient } from "@/lib/auth-client";

export function ClientExemple() {
    const { data, error, isPending } = authClient.useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4"></h1>
            {isPending ? <p>Loading...</p> :
                error ? <p className="text-red-500">Erreur: {error.message}</p> :
                    data ? <p className="text-green-500">Connecté</p> : <p className="text-red-500">Déconnecté</p>
            }
            <pre className="bg-white p-4 rounded shadow-md">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}