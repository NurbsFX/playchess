"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createUserDetails } from "@/lib/action"

export default function UserDetailsPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [username, setUsername] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createUserDetails({ username })
            toast("Succès")
            router.push("/signin")
        } catch (err: unknown) {
            const error = err as { code?: string; meta?: { target?: string[] } };
            if (error.code === "P2002" && error.meta?.target?.includes("username")) {
                toast("Nom d'utilisateur déjà pris")
            } else {
                toast("Erreur lors de l'enregistrement")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-6 border rounded-lg shadow">
                <h1 className="text-xl font-semibold">Compléter votre profil</h1>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium">Nom d&apos;utilisateur</label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ex: chessMaster92"
                        required
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Enregistrement..." : "Continuer"}
                </Button>
            </form>
        </div>
    )
}