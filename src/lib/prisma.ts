// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
        // Tu peux activer des logs si besoin
        // log: ['query', 'info', 'warn', 'error']
    })
}

export default prisma