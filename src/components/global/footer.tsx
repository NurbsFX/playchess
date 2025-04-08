"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from "next/link";
import Image from 'next/image';

const Footer = () => {

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoSrc = mounted && resolvedTheme === 'dark'
        ? '/LogoPlayChessBlanc.png'
        : '/LogoPlayChessNoir.png';
    return (
        <footer className="bg-[#EDEFF2] dark:bg-[#27272a] text-[#27272A] dark:text-white py-10 px-6 md:px-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Logo + Baseline */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={logoSrc}
                            alt="PlayChess Logo"
                            width={50}
                            height={50}
                            className="h-12 w-12 object-contain"
                        />
                    </Link>
                    <span className="text-lg dark:text-white text-[#27272a] font-semibold">PlayChess</span>
                </div>

                {/* Navigation rapide */}
                <div className="flex flex-wrap gap-6 text-sm md:text-base">
                    <Link href="/play" className="hover:text-[#6890C9] transition-colors">
                        Jouer
                    </Link>
                    <Link href="/learn" className="hover:text-[#6890C9] transition-colors">
                        Apprendre
                    </Link>
                    <Link href="/community" className="hover:text-[#6890C9] transition-colors">
                        Communauté
                    </Link>
                    <Link href="/terms" className="hover:text-[#6890C9] transition-colors">
                        Conditions d&apos;utilisation
                    </Link>
                    <Link href="/privacy" className="hover:text-[#6890C9] transition-colors">
                        Politique de confidentialité
                    </Link>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} PlayChess. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;