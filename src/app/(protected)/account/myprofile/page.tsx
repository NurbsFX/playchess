"use client";

import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile, getCurrentUserProfile } from "@/lib/action"; // <-- on importe aussi getCurrentUserProfile
import { toast } from "sonner";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [session, setSession] = useState<{ user?: { name: string; email: string } } | null>(null);

    const [profile, setProfile] = useState<{
        username: string;
        name: string;
        email: string;
        joinedAt: string | null;
        bio: string;
    } | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const sessionData = await fetchSession();
                setSession(sessionData);

                const userProfile = await getCurrentUserProfile();
                setProfile({
                    username: userProfile.username,
                    name: userProfile.name,
                    email: userProfile.email,
                    joinedAt: userProfile.joinedAt,
                    bio: userProfile.bio,
                });
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors du chargement du profil.");
            }
        }
        fetchData();
    }, []);

    const handleChange = (field: keyof NonNullable<typeof profile>, value: string) => {
        if (!profile) return;
        setProfile((prev) => ({
            ...prev!,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!profile) return;
        startTransition(async () => {
            try {
                await updateUserProfile({
                    username: profile.username,
                    name: profile.name,
                    email: profile.email,
                    bio: profile.bio,
                });
                toast.success("Profil mis à jour avec succès !");
                setIsEditing(false);
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors de la mise à jour du profil.");
            }
        });
    };

    if (!profile) {
        return <div className="flex justify-center items-center h-64">Chargement du profil...</div>;
    }

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto p-6">
            <div className="flex items-start gap-6 w-full">
                {/* Avatar à gauche */}
                <Avatar className="h-24 w-24">
                    <AvatarImage src="" alt={session?.user?.name || "Avatar"} />
                    <AvatarFallback>
                        {session?.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Infos à droite */}
                <div className="flex flex-col justify-start gap-4 w-full">
                    {/* Première ligne : Flag + Nom */}
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Input
                                    value={profile.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="text-2xl font-bold"
                                />
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold">{profile.name}</h1>
                            </>
                        )}
                    </div>

                    {/* Deuxième ligne : Username */}
                    <div>
                        {isEditing ? (
                            <Input
                                value={profile.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                className="text-lg"
                            />
                        ) : (
                            <p className="text-gray-600 text-lg">@{profile.username}</p>
                        )}
                    </div>

                    {/* Troisième ligne : Email */}
                    <div>
                        {isEditing ? (
                            <Input
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-600">{profile.email}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quatrième ligne : Bio */}
            <div className="mt-6 w-full">
                <label className="text-sm font-medium text-gray-700">Bio :</label>
                {isEditing ? (
                    <Textarea
                        value={profile.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className="mt-1"
                    />
                ) : (
                    <p className="text-gray-700 whitespace-pre-line mt-1">{profile.bio}</p>
                )}
            </div>

            <div className="flex gap-4 mt-8">
                {isEditing ? (
                    <>
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            {isPending ? "Enregistrement..." : "Sauvegarder"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            disabled={isPending}
                        >
                            Annuler
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => setIsEditing(true)}
                    >
                        Modifier
                    </Button>
                )}
            </div>
        </div>
    );
}

// --- Fetch temporaire
async function fetchSession() {
    return {
        user: {
            name: "Bruno Kalfa",
            email: "bruno@example.com",
        },
    };
}