import { buildApp } from './app.js';
import { config } from './config.js';
import { prisma } from './infrastructure/database/client.js';
import { PrismaUserRepository } from './contexts/user/infrastructure/prisma-user.repository.js';
import { Argon2PasswordHasher } from './contexts/user/infrastructure/argon2-password-hasher.js';
import { JwtTokenIssuer } from './contexts/user/infrastructure/jwt-token-issuer.js';
import { buildDocsRouter } from './infrastructure/http/docs.js';

const app = buildApp({
  users: new PrismaUserRepository(prisma),
  hasher: new Argon2PasswordHasher(),
  tokens: new JwtTokenIssuer({ secret: config.JWT_SECRET, issuer: config.JWT_ISSUER, ttlSeconds: config.JWT_TTL_SECONDS }),
  jwtSecret: config.JWT_SECRET,
  jwtIssuer: config.JWT_ISSUER,
  corsOrigins: config.CORS_ORIGINS,
  docs: await buildDocsRouter(),
});

const server = app.listen(config.PORT, () => {
  console.log(`auth listening on http://localhost:${config.PORT} — docs on /docs`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(async () => { await prisma.$disconnect(); process.exit(0); });
  });
}
