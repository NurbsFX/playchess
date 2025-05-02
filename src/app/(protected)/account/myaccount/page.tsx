'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { deleteAccountAction } from '@/lib/action'; // ← importez votre server action

export default function MyAccountPage() {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Mon compte</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Paramètres du compte</h2>
                    <p className="text-sm text-gray-600">
                        Vous pouvez supprimer définitivement votre compte. Cette action est irréversible.
                    </p>
                </section>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full md:w-auto">
                            Supprimer mon compte
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Supprimer le compte</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos données seront effacées
                                et cette action ne peut pas être annulée.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4">
                            <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                                Confirmez avec votre mot de passe
                            </label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* on utilise un form pour déclencher la server action */}
                        <form action={deleteAccountAction}>
                            <input type="hidden" name="password" value={password} />

                            <DialogFooter className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={!password.trim()}
                                >
                                    Supprimer
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Vous pouvez aussi&nbsp;
                    <Link href="/settings" className="text-primary underline">
                        modifier vos informations
                    </Link>
                    &nbsp;ou&nbsp;
                    <Link href="/" className="text-primary underline">
                        revenir à l’accueil
                    </Link>.
                </p>
            </div>
        </div>
    );
}