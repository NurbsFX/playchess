"use client";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// Schéma de validation avec zod
const formSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);

    // Initialise react-hook-form avec zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState: { errors } } = form;

    // Fonction pour gérer la soumission du formulaire
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const result = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
        });

        if (result.error) {
            toast.error(result.error.message);
            setIsLoading(false);
            return;
        }
        toast.success("Connexion réussie !");
        setIsLoading(false);
    };

    // Fonction pour gérer la connexion avec les réseaux sociaux
    const handleSocialLogin = async (provider: string) => {
        try {
            setIsLoading(true);
            window.location.href = `/api/auth/${provider}`;
        } catch (error) {
            console.error(`Erreur de connexion avec ${provider}:`, error);
            toast.error(`Erreur lors de la connexion avec ${provider}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-[#27272A] dark:text-white">
                        Connexion
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Entrez votre email pour accéder à votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Formulaire Email / Mot de passe */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votreadresse@email.com"
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    disabled={isLoading}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Connexion en cours..." : "Se connecter"}
                            </Button>
                        </div>

                        {/* Séparateur */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow h-px bg-gray-300" />
                            <span className="px-4 text-sm text-gray-500">OU</span>
                            <div className="flex-grow h-px bg-gray-300" />
                        </div>

                        {/* Connexions sociales */}
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => handleSocialLogin("google")}
                                disabled={isLoading}
                            >
                                <FaGoogle className="h-5 w-5" />
                                Continuer avec Google
                            </Button>
                            {/* Désactiver les boutons Facebook et Apple si les providers ne sont pas configurés */}
                            {/* <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => handleSocialLogin("facebook")}
                                disabled={isLoading}
                            >
                                <FaFacebookF className="h-5 w-5" />
                                Continuer avec Facebook
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => handleSocialLogin("apple")}
                                disabled={isLoading}
                            >
                                <FaApple className="h-5 w-5" />
                                Continuer avec Apple
                            </Button> */}
                        </div>

                        {/* Lien vers Inscription */}
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Vous n&apos;avez pas encore de compte ?{" "}
                            <Link href="/signup" className="underline hover:text-[#6890C9]">
                                Inscrivez-vous
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}