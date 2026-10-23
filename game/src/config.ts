import { z } from 'zod';
try { process.loadEnvFile('.env'); } catch { }

const Env = z.object({
    PORT: z.coerce.number().int().min(1).default(3000),
});

export const config = Env.parse(process.env);