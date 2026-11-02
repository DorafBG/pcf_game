import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../../config.js';

/** TP3 : Postgres via driver adapter (Prisma 7). Un conteneur Postgres par service. */
const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
