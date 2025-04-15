"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from '../items/darkmode';
import { Button } from '../ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { FaRegChessPawn, FaRegChessKing } from "react-icons/fa6";
import { BiSolidChess } from "react-icons/bi";
import { GraduationCap, Users, BookOpenText, MessageCircleMore, Brain, BrainCircuit, User } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { NotificationBell } from '../items/notification-bell';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Définir le type pour la session
type Session = {
    user?: {
        id: string;
        email: string;
        name?: string;
    };
} | null;

// Modifier l'interface pour accepter la session comme prop
interface NavbarProps {
    session: Session;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && resolvedTheme === 'dark'
        ? '/LogoPlayChessBlanc.png'
        : '/LogoPlayChessNoir.png';

    const learn: { title: string; href: string; description: string; logo?: React.ReactNode }[] = [
        {
            title: "Leçons",
            logo: <BookOpenText className="h-5 w-5" />,
            href: "/docs/primitives/alert-dialog",
            description:
                "Apprenez les bases et perfectionnez vos compétences grâce à des leçons interactives adaptées à votre niveau.",
        },
        {
            title: "Résoudre des problèmes",
            logo: <Brain className="h-5 w-5" />,
            href: "/docs/primitives/alert-dialog",
            description:
                "Entraînez-vous à repérer les tactiques et les coups décisifs en résolvant des positions difficiles.",
        },
        {
            title: "Ouvertures",
            logo: <BiSolidChess className="h-5 w-5" />,
            href: "/docs/primitives/tabs",
            description:
                "Découvrez et approfondissez différentes ouvertures pour bien commencer chaque partie.",
        },
        {
            title: "Finales",
            logo: <FaRegChessKing className="h-5 w-5" />,
            href: "/docs/primitives/tooltip",
            description:
                "Maîtrisez l'art de convertir vos avantages en victoire grâce à des exercices de finales.",
        },
        {
            title: "S'entraîner avec une IA",
            logo: <BrainCircuit className="h-5 w-5" />,
            href: "/docs/primitives/tooltip",
            description:
                "Affrontez une intelligence artificielle de différents niveaux pour progresser et affiner votre jeu.",
        },
    ];
    const community: { title: string; href: string; description: string; logo?: React.ReactNode }[] = [
        {
            title: "Forum",
            href: "/docs/primitives/alert-dialog",
            description:
                "Discutez avec d'autres passionnés d'échecs, partagez vos stratégies et demandez des conseils sur notre forum dédié.",
            logo: <MessageCircleMore className="h-5 w-5" />,
        },
        {
            title: "Membres",
            href: "/docs/primitives/alert-dialog",
            description:
                "Découvrez les profils des autres joueurs, suivez vos amis et développez votre réseau au sein de la communauté PlayChess.",
            logo: <Users className="h-5 w-5" />,
        }
    ];

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/"); // Redirige
        router.refresh(); // Puis refresh
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#27272A] shadow">
            {/* Container global */}
            <div className="container mx-auto flex items-center justify-between py-4 px-6 ">

                {/* Logo + Menu Desktop */}
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={logoSrc}
                            alt="PlayChess Logo"
                            width={50}
                            height={50}
                            className="h-12 w-12 object-contain"
                        />
                    </Link>

                    {/* Menu Desktop (caché sur mobile) */}
                    <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-200 font-medium">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="flex items-center gap-2 text-base font-medium transition-colors bg-white dark:bg-[#27272A] hover:text-[#6890C9]">
                                        <FaRegChessPawn className="h-5 w-5" />
                                        Jouer
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            {/* Exemple d'item avec image de fond */}
                                            <li className="relative row-span-3 overflow-hidden rounded-xl group">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        className="relative z-10 flex h-full w-full select-none flex-col justify-end p-6 no-underline outline-none focus:shadow-md bg-transparent hover:bg-transparent active:bg-transparent"
                                                        href="/"
                                                    >
                                                        <div className="relative z-30 mb-2 mt-4 text-lg font-bold text-white">
                                                            Mes parties
                                                        </div>
                                                        <p className="relative z-30 text-sm leading-tight text-white">
                                                            Retrouvez toutes vos parties en cours et analysées.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>

                                                <Image
                                                    src="/cavalierbackground.jpg"
                                                    alt="Background Cavalier"
                                                    fill
                                                    className="object-cover object-center absolute inset-0 z-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
                                                    priority
                                                />
                                            </li>

                                            <ListItem href="/play/versus" title="Jouer contre un adversaire">
                                                Trouvez un adversaire en ligne instantanément et commencez une partie en quelques secondes.
                                            </ListItem>

                                            <ListItem href="/play/ai" title="Jouer contre une IA">
                                                Entraînez-vous contre notre IA, adaptée à tous les niveaux de jeu.
                                            </ListItem>

                                            <ListItem href="/play/tournament" title="S'inscrire à un tournoi">
                                                Participez à des tournois en ligne pour défier d&apos;autres joueurs et remporter des trophées.
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Menu Apprendre */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-white dark:bg-[#27272A] flex items-center gap-2 text-base font-medium transition-colors hover:text-[#6890C9]">
                                        <GraduationCap className="h-5 w-5" />
                                        Apprendre
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {learn.map((component) => (
                                                <ListItem
                                                    key={component.title}
                                                    title={component.title}
                                                    href={component.href}
                                                    logo={component.logo} // ➔ Ajouté ici !
                                                >
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Menu Communauté */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-white dark:bg-[#27272A] flex items-center gap-2 text-base font-medium transition-colors hover:text-[#6890C9]">
                                        <Users className="h-5 w-5" />
                                        Communauté
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {community.map((component) => (
                                                <ListItem
                                                    key={component.title}
                                                    title={component.title}
                                                    href={component.href}
                                                    logo={component.logo} // ➔ on passe aussi le logo ici !
                                                >
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <ModeToggle />
                    <div className="flex gap-4">
                        {
                            session ?
                                <div className="flex items-center gap-3 bg-muted/40 p-1.5 rounded-full">
                                    {/* Bouton notifications */}
                                    <NotificationBell
                                    />

                                    {/* Bouton utilisateur */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar className="h-9 w-9 cursor-pointer">
                                                <AvatarImage src="" alt={session.user?.name || "Avatar"} />
                                                <AvatarFallback>
                                                    {session.user?.name
                                                        ?.split(" ")
                                                        .map(n => n[0])
                                                        .join("")
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    Profil
                                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Paramètres
                                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleSignOut}>
                                                Se déconnecter
                                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                :
                                <div className="flex gap-4">
                                    <Link href="/signup">
                                        <Button className="bg-[#6890C9] dark:bg-[#EDEFF2] text-white dark:text-black hover:bg-[#5678A8] dark:hover:bg-[#D1D5DB]">
                                            S&apos;inscrire
                                        </Button>
                                    </Link>
                                    <Link href="/signin">
                                        <Button className="bg-[#6890C9] dark:bg-[#EDEFF2] text-white dark:text-black hover:bg-[#5678A8] dark:hover:bg-[#D1D5DB]">
                                            Connexion
                                        </Button>
                                    </Link>
                                </div>
                        }

                    </div>
                </div>

            </div>
        </nav >
    );
};

export default Navbar;

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { logo?: React.ReactNode }
>(({ className, title, children, logo, ...props }, ref) => {
    function cn(...classes: (string | undefined | null | false)[]): string {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-2 rounded-md p-3 leading-normal whitespace-normal break-words no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-base font-medium leading-normal">
                        {logo && <span className="text-[#6890C9]">{logo}</span>}
                        {title}
                    </div>
                    <p className=" text-sm text-gray-500 leading-normal">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";