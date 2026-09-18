import argon2 from 'argon2';
import { prisma } from './client.js';

/** Un admin de démonstration. Mot de passe : admin-polyshop-2026 */
const email = 'admin@polyshop.fr';
const passwordHash = await argon2.hash('admin-polyshop-2026');
await prisma.user.upsert({ where: { email }, update: {}, create: { email, passwordHash, role: 'admin' } });
console.log(`seeded admin ${email}`);
await prisma.$disconnect();
