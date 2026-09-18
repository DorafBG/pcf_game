import { z } from 'zod';

export const Credentials = z.object({
  email: z.email().max(254).transform((e) => e.toLowerCase()),
  password: z.string().min(8, 'password must be at least 8 characters').max(128),
});
export type Credentials = z.infer<typeof Credentials>;

export const PublicUserOutput = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(['user', 'admin']),
  createdAt: z.date().transform((d) => d.toISOString()),
});
