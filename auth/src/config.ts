import { z } from 'zod';

try { process.loadEnvFile('.env'); } catch { /* en conteneur, variables injectées par Compose */ }

const Env = z.object({
  PORT: z.coerce.number().int().min(1).default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ISSUER: z.string().default('polyshop-auth'),
  JWT_TTL_SECONDS: z.coerce.number().int().min(60).default(900),
  CORS_ORIGINS: z.string().default('http://localhost:5173').transform((s) => s.split(',').map((o) => o.trim())),
  SERVICE_NAME: z.string().default('auth'),
});

/** Un service mal configuré refuse de démarrer (12-factor, M10). */
export const config = Env.parse(process.env);
