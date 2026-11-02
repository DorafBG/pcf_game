import { defineConfig, env } from 'prisma/config';

// Charge les variables d'environnement si un fichier .env existe en local
try { process.loadEnvFile('.env'); } catch { /* pas de fichier .env */ }

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
