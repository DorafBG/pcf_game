import { defineConfig, env } from 'prisma/config';

// Node 22 : charge .env nativement (pas de dotenv). Ignoré s'il n'existe pas (Docker : variables injectées).
try { process.loadEnvFile('.env'); } catch { /* pas de .env */ }

export default defineConfig({
  schema: 'src/infrastructure/database/schema.prisma',
  migrations: {
    path: 'src/infrastructure/database/migrations',
    seed: 'tsx src/infrastructure/database/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
