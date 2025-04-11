import { object, string } from "zod";

const getPasswordSchema = (field: "password" | "confirmPassword") =>
    string({ required_error: `${field} est requis` })
        .min(8, `${field} doit contenir au moins 8 caractères`)
        .max(32, `${field} ne doit pas dépasser 32 caractères`);

const getEmailSchema = () =>
    string({ required_error: "Email est requis" })
        .min(1, "Email est requis")
        .email("Format d'email invalide");

const getNameSchema = (field: "firstName" | "lastName") =>
    string({ required_error: `${field === "firstName" ? "Prénom" : "Nom"} est requis` })
        .min(1, `${field === "firstName" ? "Prénom" : "Nom"} est requis`)
        .max(50, `${field === "firstName" ? "Prénom" : "Nom"} doit faire moins de 50 caractères`);

const getPhoneSchema = () =>
    string({ required_error: "Numéro de téléphone est requis" })
        .min(10, "Numéro de téléphone invalide")
        .max(15, "Numéro de téléphone invalide")
        .regex(/^[0-9]+$/, "Numéro de téléphone invalide (chiffres uniquement)");

export const signUpSchema = object({
    firstName: getNameSchema("firstName"),
    lastName: getNameSchema("lastName"),
    email: getEmailSchema(),
    phone: getPhoneSchema(),
    password: getPasswordSchema("password"),
    confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export const signInSchema = object({
    email: getEmailSchema(),
    password: getPasswordSchema("password"),
});

export const forgotPasswordSchema = object({
    email: getEmailSchema(),
});

export const resetPasswordSchema = object({
    password: getPasswordSchema("password"),
    confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});