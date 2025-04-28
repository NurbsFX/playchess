"use client";

import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile, getFullCurrentUserProfile } from "@/lib/action";
import { toast } from "sonner";
import { Mail, Pencil } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [profile, setProfile] = useState<{
        username: string;
        name: string;
        email: string;
        joinedAt: string | null;
        bio: string;
        flag: string;
        image: string;
    } | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const fullProfile = await getFullCurrentUserProfile();
                setProfile({
                    username: fullProfile.username,
                    name: fullProfile.name,
                    email: fullProfile.email,
                    joinedAt: fullProfile.createdAt,
                    bio: fullProfile.bio,
                    flag: fullProfile.flag,
                    image: fullProfile.image ?? "", // <-- Ajout ici
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
                    flag: profile.flag ?? "",
                    image: profile.image,
                });
                toast.success("Profil mis à jour !");
                setEditingField(null);
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors de la sauvegarde.");
            }
        });
    };

    if (!profile) {
        return <div className="flex justify-center items-center h-64">Chargement...</div>;
    }

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto p-6">
            <div className="flex items-start gap-6 w-full">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-2">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={profile?.image || ""}
                                alt={profile?.name || "Avatar"}
                            />
                            <AvatarFallback>
                                {profile?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Modifier l'image */}
                        {editingField === "image" ? (
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const base64String = reader.result as string;
                                            handleChange("image", base64String); // on enregistre l'image encodée
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="mt-2 w-40 text-xs"
                            />
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingField("image")}
                                className="mt-2 text-xs text-gray-500 hover:text-black"
                            >
                                Modifier l&apos;image
                            </Button>
                        )}
                    </div>
                </div>

                {/* Infos */}
                <div className="flex flex-col justify-start gap-4 w-full">
                    {/* Flag + Nom */}
                    <div className="flex items-center gap-2">
                        {/* Flag */}
                        {editingField === "flag" ? (
                            <Select
                                value={profile.flag}
                                onValueChange={(value) => handleChange("flag", value)}
                            >
                                <SelectTrigger className="w-[80px] text-2xl text-center">
                                    <SelectValue>{profile.flag}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Choisir un drapeau</SelectLabel>
                                        {Array.from(new Set([
                                            "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿",
                                            "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇦", "🇧🇼", "🇧🇻", "🇧🇷", "🇮🇴",
                                            "🇻🇬", "🇧🇳", "🇧🇬", "🇧🇫", "🇧🇮", "🇰🇭", "🇨🇲", "🇨🇦", "🇨🇻", "🇰🇾", "🇨🇫", "🇹🇩", "🇨🇱", "🇨🇳", "🇨🇽", "🇨🇨",
                                            "🇨🇴", "🇰🇲", "🇨🇬", "🇨🇩", "🇨🇰", "🇨🇷", "🇭🇷", "🇨🇺", "🇨🇼", "🇨🇾", "🇨🇿", "🇩🇰", "🇩🇯", "🇩🇲", "🇩🇴", "🇪🇨",
                                            "🇪🇬", "🇸🇻", "🇬🇶", "🇪🇷", "🇪🇪", "🇪🇹", "🇫🇰", "🇫🇴", "🇫🇯", "🇫🇮", "🇫🇷", "🇬🇫", "🇵🇫", "🇹🇫", "🇬🇦", "🇬🇲",
                                            "🇬🇪", "🇩🇪", "🇬🇭", "🇬🇮", "🇬🇷", "🇬🇱", "🇬🇩", "🇬🇵", "🇬🇺", "🇬🇹", "🇬🇬", "🇬🇳", "🇬🇼", "🇬🇾", "🇭🇹", "🇭🇲",
                                            "🇻🇦", "🇭🇳", "🇭🇰", "🇭🇺", "🇮🇸", "🇮🇳", "🇮🇩", "🇮🇷", "🇮🇶", "🇮🇪", "🇮🇲", "🇮🇱", "🇮🇹", "🇨🇮", "🇯🇲", "🇯🇵",
                                            "🇯🇪", "🇯🇴", "🇰🇿", "🇰🇪", "🇰🇮", "🇽🇰", "🇰🇼", "🇰🇬", "🇱🇦", "🇱🇻", "🇱🇧", "🇱🇸", "🇱🇷", "🇱🇾", "🇱🇮", "🇱🇹",
                                            "🇱🇺", "🇲🇴", "🇲🇰", "🇲🇬", "🇲🇼", "🇲🇾", "🇲🇻", "🇲🇱", "🇲🇹", "🇲🇭", "🇲🇶", "🇲🇷", "🇲🇺", "🇾🇹", "🇲🇽", "🇫🇲",
                                            "🇲🇩", "🇲🇨", "🇲🇳", "🇲🇪", "🇲🇸", "🇲🇦", "🇲🇿", "🇲🇲", "🇳🇦", "🇳🇷", "🇳🇵", "🇳🇱", "🇳🇨", "🇳🇿", "🇳🇮", "🇳🇪",
                                            "🇳🇬", "🇳🇺", "🇳🇫", "🇰🇵", "🇲🇵", "🇳🇴", "🇴🇲", "🇵🇰", "🇵🇼", "🇵🇸", "🇵🇦", "🇵🇬", "🇵🇾", "🇵🇪", "🇵🇭", "🇵🇳",
                                            "🇵🇱", "🇵🇹", "🇵🇷", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇺", "🇷🇼", "🇧🇱", "🇸🇭", "🇰🇳", "🇱🇨", "🇲🇫", "🇻🇨", "🇼🇸", "🇸🇲",
                                            "🇸🇹", "🇸🇦", "🇸🇳", "🇷🇸", "🇸🇨", "🇸🇱", "🇸🇬", "🇸🇽", "🇸🇰", "🇸🇮", "🇸🇧", "🇸🇴", "🇿🇦", "🇬🇸", "🇰🇷", "🇸🇸",
                                            "🇪🇸", "🇱🇰", "🇸🇩", "🇸🇷", "🇸🇯", "🇸🇪", "🇨🇭", "🇸🇾", "🇹🇼", "🇹🇯", "🇹🇿", "🇹🇭", "🇹🇱", "🇹🇬", "🇹🇰", "🇹🇴",
                                            "🇹🇹", "🇹🇳", "🇹🇷", "🇹🇲", "🇹🇨", "🇹🇻", "🇺🇬", "🇺🇦", "🇦🇪", "🇬🇧", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇺", "🇻🇪", "🇻🇳",
                                            "🇼🇫", "🇪🇭", "🇾🇪", "🇿🇲", "🇿🇼"
                                        ])).map((flag) => (
                                            <SelectItem key={flag} value={flag}>
                                                {flag}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex items-center gap-1">
                                <span className="text-2xl">{profile.flag}</span>
                                <Pencil
                                    size={16}
                                    className="cursor-pointer text-gray-400"
                                    onClick={() => setEditingField(editingField === "flag" ? null : "flag")}
                                />
                            </div>
                        )}

                        {/* Name */}
                        {editingField === "name" ? (
                            <Input
                                value={profile.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="text-2xl font-bold w-fit"
                            />
                        ) : (
                            <div className="flex items-center gap-1">
                                <h1 className="text-2xl font-bold">{profile.name}</h1>
                                <Pencil
                                    size={16}
                                    className="cursor-pointer text-gray-400"
                                    onClick={() => setEditingField(editingField === "name" ? null : "name")}
                                />
                            </div>
                        )}
                    </div>

                    {/* Username */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-base">@</span>
                        {editingField === "username" ? (
                            <Input
                                value={profile.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                className="text-base w-fit"
                            />
                        ) : (
                            <p className="text-gray-600 text-base">{profile.username}</p>
                        )}
                        <Pencil
                            size={16}
                            className="cursor-pointer text-gray-400"
                            onClick={() => setEditingField(editingField === "username" ? null : "username")}
                        />
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-5 w-5" />
                        <p className="text-sm">{profile.email}</p>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="mt-6 w-full">
                <label className="text-sm font-medium text-gray-700">Bio :</label>
                <div className="flex gap-2 items-start">
                    {editingField === "bio" ? (
                        <Textarea
                            value={profile.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            className="mt-1"
                        />
                    ) : (
                        <p className="text-gray-700 whitespace-pre-line mt-1">{profile.bio}</p>
                    )}
                    <Pencil
                        size={16}
                        className="cursor-pointer text-gray-400"
                        onClick={() => setEditingField(editingField === "bio" ? null : "bio")}
                    />
                </div>
            </div>

            {/* Save button uniquement si un champ est en cours d'édition */}
            {editingField && (
                <div className="flex justify-center gap-4 mt-8 w-full">
                    <Button
                        variant="outline"
                        onClick={() => setEditingField(null)}
                        disabled={isPending}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                    >
                        {isPending ? "Enregistrement..." : "Sauvegarder"}
                    </Button>
                </div>
            )}
        </div>
    );
}
