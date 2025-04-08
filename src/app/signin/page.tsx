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
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";

export default function LoginForm({
    className,
}: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex min-h-screen items-center justify-center p-6", className)}>
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
                    <form className="space-y-6">
                        {/* Formulaire Email / Mot de passe */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votreadresse@email.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </div>

                            <Button type="submit" className="w-full">
                                Se connecter
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
                        </div>

                        {/* Lien vers Inscription */}
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Vous n&apos;avez pas encore de compte ?{" "}
                            <a href="#" className="underline hover:text-[#6890C9]">
                                Inscrivez-vous
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}