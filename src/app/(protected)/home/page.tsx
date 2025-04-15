// app/players/page.tsx
import { getAllPlayers } from '@/lib/action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/lib/auth'
import { headers } from "next/headers";
import { InviteButton } from '@/components/items/invite-button';

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() });
    const users = await getAllPlayers()
    const currentUserId = session?.user?.id

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Liste des joueurs</h1>
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
                                <p className="text-sm text-primary">ELO : {user.elo}</p>
                            </div>
                        </div>

                        {user.id !== currentUserId && (
                            <InviteButton receiverId={user.id} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}