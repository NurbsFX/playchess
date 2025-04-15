import { createAuthClient } from "better-auth/react";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Crée une instance du client BetterAuth
export const authClient = createAuthClient({
    /** 
     * baseURL est optionnel : 
     * Si ton serveur et ton client sont sur le même domaine (ex: localhost:3000), tu peux même l’enlever
     */


    baseURL: baseUrl,// ⬅️ Attention en production : mettre le bon domaine (ex: https://playchess.com)
});
