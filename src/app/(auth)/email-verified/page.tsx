"use client";

import React from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerifiedPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email vérifié !</CardTitle>
          <CardDescription>
            Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/">Retour à la page d&apos;accueil</Link>
          </Button>

        </CardFooter>
      </Card>
    </div>
  );
} 