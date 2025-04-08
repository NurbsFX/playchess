"use client";

import { cn } from "@/lib/utils"
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
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react";

// ✅ 1. Le schéma de validation avec zod
const formSchema = z.object({
    firstName: z.string().min(2, "Le prénom est requis"),
    lastName: z.string().min(2, "Le nom est requis"),
    username: z.string().min(2, "L'username est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Confirmation requise"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"], // ✅ précise sur quel champ afficher l'erreur
})



export default function SignUpForm({
    className,

}: React.ComponentPropsWithoutRef<"div">) {

    const router = useRouter()
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // ✅ 2. Initialise react-hook-form avec zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username:"",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { register, handleSubmit, formState: { errors } } = form

    // Fonction pour gérer la soumission du formulaire
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/auth/email/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    attributes: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phone: values.phone,
                        username: values.username,
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "Erreur lors de l'inscription");
            }

            // Afficher le dialogue de succès au lieu de rediriger directement
            setShowSuccessDialog(true);
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            alert(error instanceof Error ? error.message : "Erreur lors de l'inscription");
        }
    };

    return (
        <div className={cn("flex min-h-screen items-center justify-center p-6", className)}>
            <Card className="w-full max-w-5xl p-6">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-[#27272A] dark:text-white">
                        Inscription
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Créez votre compte pour rejoindre PlayChess
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Partie formulaire classique */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input 
                                        id="firstName" 
                                        type="text" 
                                        placeholder="Votre prénom" 
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input 
                                        id="lastName" 
                                        type="text" 
                                        placeholder="Votre nom" 
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="monusername"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votreadresse@email.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+33 6 12 34 56 78"
                                    {...register("phone")}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                                <Input 
                                    id="confirm-password" 
                                    type="password" 
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>



                            <Button type="submit" className="w-full mt-4">
                                S&apos;inscrire
                            </Button>
                        </form>

                        {/* Partie connexion sociale */}
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="text-center text-gray-600 dark:text-gray-400 mb-2">
                                Ou inscrivez-vous avec
                            </div>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                <FaGoogle className="h-5 w-5" />
                                Continuer avec Google
                            </Button>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                <FaFacebookF className="h-5 w-5" />
                                Continuer avec Facebook
                            </Button>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                <FaApple className="h-5 w-5" />
                                Continuer avec Apple
                            </Button>

                            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                Vous avez déjà un compte ?{" "}
                                <a href="#" className="underline hover:text-[#6890C9]">
                                    Connectez-vous
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Dialogue de succès */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Inscription réussie !</AlertDialogTitle>
                        <AlertDialogDescription>
                            Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter et commencer à jouer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => router.push("/")}>
                            Retour à l&apos;accueil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}