import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { email, password, attributes } = await request.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: { message: "Un utilisateur avec cet email existe déjà" } },
        { status: 400 }
      );
    }

    // Générer un nom d'utilisateur unique basé sur l'email
    const baseUsername = email.split("@")[0];
    let username = baseUsername;
    let counter = 1;

    // Vérifier si le nom d'utilisateur existe déjà et ajouter un numéro si nécessaire
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName: attributes?.firstName,
        lastName: attributes?.lastName,
        phone: attributes?.phone,
        password: hashedPassword,
      },
    });

    // Créer une entrée dans l'historique ELO
    await prisma.eloHistory.create({
      data: {
        userId: user.id,
        rating: 1200, // Rating initial
      },
    });

    return NextResponse.json(
      { message: "Inscription réussie", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: { message: "Erreur lors de l'inscription" } },
      { status: 500 }
    );
  }
} 