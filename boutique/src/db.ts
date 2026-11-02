import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

// charge le .env local si present
try { process.loadEnvFile('.env'); } catch { /* ignore */ }

// URL de connexion PostgreSQL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('[Boutique] Erreur critique : La variable d\'environnement DATABASE_URL est obligatoire.');
}


const adapter = new PrismaPg({ connectionString: databaseUrl });
export const prisma = new PrismaClient({ adapter });
