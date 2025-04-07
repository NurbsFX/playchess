"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from '@/components/items/darkmode';
import { Button } from '../ui/button';

const Navbar: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && resolvedTheme === 'dark'
        ? '/LogoPlayChessBlanc.png'
        : '/LogoPlayChessNoir.png';

    return (
        <nav className="w-full bg-[#EDEFF2] dark:bg-[#27272A]">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <div className="flex items-center space-x-8">
                    {/* Logo cliquable */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src={logoSrc}
                            alt="PlayChess Logo"
                            width={50}
                            height={50}
                            className="h-12 w-12 object-contain" // meilleure taille et rendu propre
                        />
                    </Link>

                    {/* Liens de navigation */}
                    <div className="flex items-center space-x-6 text-gray-700 dark:text-gray-200 font-medium">
                        <Link href="/play" className="font-semibold hover:text-[#6890C9] transition-colors">
                            Jouer
                        </Link>
                        <Link href="/learn" className="font-semibold hover:text-[#6890C9] transition-colors">
                            Apprendre
                        </Link>
                        <Link href="/community" className="font-semibold hover:text-[#6890C9] transition-colors">
                            Communauté
                        </Link>
                    </div>
                </div>
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
            </div>
        </nav>
    );
};

export default Navbar;