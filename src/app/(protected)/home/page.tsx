'use client'

import { useEffect, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type User = {
    id: string
    name: string
    email: string
    image?: string
}

export default function Page() {
    const [users, setUsers] = useState<User[]>([])
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionRes, usersRes] = await Promise.all([
                    fetch('/api/session'),
                    fetch('/api/players'),
                ])

                if (!sessionRes.ok) throw new Error('Erreur lors de la récupération de la session')
                if (!usersRes.ok) throw new Error('Erreur lors de la récupération des utilisateurs')

                const sessionData = await sessionRes.json()
                const usersData = await usersRes.json()

                setCurrentUserId(sessionData.id)
                setUsers(usersData)
            } catch (error) {
                console.error('Erreur:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Liste des joueurs</h1>

            {loading ? (
                <p className="text-muted-foreground">Chargement des utilisateurs...</p>
            ) : users.length === 0 ? (
                <p>Aucun joueur trouvé.</p>
            ) : (
                <ul className="w-full max-w-md space-y-3">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="flex items-center justify-between gap-4 border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={user.image || ''} alt={user.name} />
                                    <AvatarFallback>
                                        {user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            {user.id !== currentUserId && (
                                <Button size="sm" variant="outline">
                                    Invite
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}