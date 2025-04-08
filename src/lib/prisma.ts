// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma: PrismaClient

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
        // Tu peux activer des logs si besoin
        // log: ['query', 'info', 'warn', 'error']
    })
}
prisma = globalForPrisma.prisma

export default prisma