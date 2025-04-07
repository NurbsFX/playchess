"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from '../items/darkmode';
import { Button } from '../ui/button';
import { Menu } from "lucide-react";
import { motion } from "framer-motion"; // Import Framer Motion ✨
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "../ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // ➔ Ajoute ça pour cacher proprement
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { FaRegChessPawn } from "react-icons/fa6";
import { GraduationCap, Users } from 'lucide-react';





const Navbar: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && resolvedTheme === 'dark'
        ? '/LogoPlayChessBlanc.png'
        : '/LogoPlayChessNoir.png';

    const components: { title: string; href: string; description: string }[] = [
        {
            title: "Alert Dialog",
            href: "/docs/primitives/alert-dialog",
            description:
                "A modal dialog that interrupts the user with important content and expects a response.",
        },
        {
            title: "Hover Card",
            href: "/docs/primitives/hover-card",
            description:
                "For sighted users to preview content available behind a link.",
        },
        {
            title: "Progress",
            href: "/docs/primitives/progress",
            description:
                "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
        },
        {
            title: "Scroll-area",
            href: "/docs/primitives/scroll-area",
            description: "Visually or semantically separates content.",
        },
        {
            title: "Tabs",
            href: "/docs/primitives/tabs",
            description:
                "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        },
        {
            title: "Tooltip",
            href: "/docs/primitives/tooltip",
            description:
                "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        },
    ]

    return (
        <nav className="w-full bg-[#EDEFF2] dark:bg-[#27272A] shadow">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo + liens */}
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

                    <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-200 font-medium">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="flex items-center gap-2 text-base font-medium transition-colors hover:text-[#6890C9]">
                                        <FaRegChessPawn className="h-5 w-5" />
                                        Jouer
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">

                                            <li className="relative row-span-3 overflow-hidden rounded-xl group">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        className="relative z-10 flex h-full w-full select-none flex-col justify-end p-6 no-underline outline-none focus:shadow-md bg-transparent hover:bg-transparent active:bg-transparent"
                                                        href="/"
                                                    >
                                                        {/* Contenu */}
                                                        <div className="relative z-30 mb-2 mt-4 text-lg font-bold text-white">
                                                            Mes parties
                                                        </div>
                                                        <p className="relative z-30 text-sm leading-tight text-white">
                                                            Retrouvez toutes vos parties en cours et jouées précédemment, analysez vos coups et suivez votre progression.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>

                                                {/* Image en fond */}
                                                <Image
                                                    src="/cavalierbackground.jpg"
                                                    alt="Background Cavalier"
                                                    fill
                                                    className="object-cover object-center absolute inset-0 z-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
                                                    priority
                                                />
                                            </li>

                                            <ListItem href="/play/versus" title="Jouer contre un adversaire">
                                                Trouvez un adversaire en ligne instantanément et commencez une nouvelle partie en quelques secondes.
                                            </ListItem>

                                            <ListItem href="/play/ai" title="Jouer contre une IA">
                                                Entraînez-vous contre notre intelligence artificielle, adaptée à tous les niveaux de jeu.
                                            </ListItem>

                                            <ListItem href="/play/tournament" title="S'inscrire à un tournoi">
                                                Participez à des tournois en ligne pour défier d&apos;autres joueurs et remporter des trophées.
                                            </ListItem>

                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="flex items-center gap-2 text-base font-medium transition-colors hover:text-[#6890C9]">
                                        <GraduationCap className="h-5 w-5" />
                                        Apprendre
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                            {components.map((component) => (
                                                <ListItem
                                                    key={component.title}
                                                    title={component.title}
                                                    href={component.href}
                                                >
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="flex items-center gap-2 text-base font-medium transition-colors hover:text-[#6890C9]">
                                        <Users className="h-5 w-5" />
                                        Communauté
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                            {components.map((component) => (
                                                <ListItem
                                                    key={component.title}
                                                    title={component.title}
                                                    href={component.href}
                                                >
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/docs" legacyBehavior passHref>
                                        <NavigationMenuLink className="hover:text-[#6890C9] transition-colors">
                                            Documentation
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <Link href="/community" className="hover:text-[#6890C9] transition-colors">
                            Communauté
                        </Link>
                    </div>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <ModeToggle />
                    <Button className="bg-[#6890C9] dark:bg-[#EDEFF2] hover:bg-[#5678A8] dark:hover:bg-[#D1D5DB] transition-colors duration-300 ease-in-out">
                        <Link href="/" className="text-white dark:text-black">
                            S&apos;inscrire
                        </Link>
                    </Button>
                    <Button className="bg-[#6890C9] dark:bg-[#EDEFF2] hover:bg-[#5678A8] dark:hover:bg-[#D1D5DB] transition-colors duration-300 ease-in-out">
                        <Link href="/" className="text-white dark:text-black">
                            Connexion
                        </Link>
                    </Button>
                </div>

                {/* Menu Mobile */}
                <div className="md:hidden flex items-center space-x-4">
                    <ModeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0">
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col h-full bg-[#EDEFF2] dark:bg-[#27272A] p-6"
                            >
                                {/* 👇 Titre invisible mais présent pour l'accessibilité */}
                                <VisuallyHidden>
                                    <SheetTitle>Menu de Navigation</SheetTitle>
                                </VisuallyHidden>

                                {/* Le reste de ton menu */}
                                <div className="flex flex-col space-y-4 text-gray-800 dark:text-gray-200 font-semibold text-lg">
                                    <Link href="/play" className="hover:text-[#6890C9] transition-colors">
                                        Jouer
                                    </Link>
                                    <Link href="/learn" className="hover:text-[#6890C9] transition-colors">
                                        Apprendre
                                    </Link>
                                    <Link href="/community" className="hover:text-[#6890C9] transition-colors">
                                        Communauté
                                    </Link>
                                </div>

                                <div className="border-t border-gray-300 dark:border-gray-600 my-6" />

                                <div className="flex flex-col space-y-4">
                                    <Button className="bg-[#6890C9] dark:bg-[#EDEFF2] text-white dark:text-black hover:bg-[#5678A8] dark:hover:bg-[#D1D5DB] w-full">
                                        <Link href="/" className="w-full text-center">
                                            S&apos;inscrire
                                        </Link>
                                    </Button>
                                    <Button className="bg-[#6890C9] dark:bg-[#EDEFF2] text-white dark:text-black hover:bg-[#5678A8] dark:hover:bg-[#D1D5DB] w-full">
                                        <Link href="/" className="w-full text-center">
                                            Connexion
                                        </Link>
                                    </Button>
                                </div>

                                <div className="mt-auto">
                                    <SheetClose asChild>
                                        <Button variant="ghost" className="w-full">
                                            Fermer
                                        </Button>
                                    </SheetClose>
                                </div>
                            </motion.div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    function cn(...classes: (string | undefined | null | false)[]): string {
        return classes.filter(Boolean).join(' ');
    }
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"