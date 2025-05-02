"use client";

import { countries } from "@/lib/countries";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { createUserDetails } from "@/lib/action";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Crown } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    username: z
        .string()
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    country: z.string().length(2, "Veuillez sélectionner un pays"),
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export default function SignUp() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            country: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);

        // 1) Création du compte
        const { error } = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: `${values.firstName} ${values.lastName}`,
        });

        // 2) Récupérer l’objet country depuis la liste
        const selectedCountry = countries.find((c) => c.code === values.country);

        // 3) Création du profil détaillé (server action)
        try {
            await createUserDetails({
                username: values.username,
                country: selectedCountry?.name ?? values.country,
                flag: selectedCountry?.flag,
            });
        } catch (e) {
            console.error("Erreur lors de la création du username :", e);
            toast(
                "Compte créé, mais impossible de sauvegarder votre nom d'utilisateur.",
            );
            // on continue quand même
        }

        if (error) {
            toast(
                "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
            );
            setIsLoading(false);
            return;
        }

        toast(
            "Un email de vérification a été envoyé à votre adresse email.",
        );
        router.push("/signin");
        setIsLoading(false);
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Crown className="mr-2 h-6 w-6" /> PlayChess
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            PlayChess m&pos;a permis de progresser rapidement dans ma pratique du jeu d&apos;échecs.
                        </p>
                        <footer className="text-sm">Sofia Rodriguez</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <Crown className="mx-auto h-6 w-6" />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Créer un compte
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entrez vos informations pour créer votre compte
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prénom</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom d&apos;utilisateur</FormLabel>
                                            <FormControl>
                                                <Input placeholder="votre_pseudo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Country → Select */}
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pays</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un pays" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map((c) => (
                                                            // On stocke `c.code` dans field.value
                                                            <SelectItem key={c.code} value={c.code}>
                                                                <span className="mr-2">{c.flag}</span>
                                                                {c.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input placeholder="********" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <Input placeholder="********" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="text-sm text-red-500">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Création en cours...
                                    </>
                                ) : (
                                    "Créer un compte"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Ou continuer avec
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" disabled={isLoading}>
                            <FcGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button variant="outline" disabled={isLoading}>
                            <FaFacebookF className="mr-2 h-4 w-4" />
                            Facebook
                        </Button>
                        <Button variant="outline" disabled={isLoading}>
                            <FaApple className="mr-2 h-4 w-4" />
                            Apple
                        </Button>
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Déjà un compte ?{" "}
                        <Link
                            href="/signin"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
}