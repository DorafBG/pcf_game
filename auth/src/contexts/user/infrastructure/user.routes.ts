import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import type { UserUseCases } from '../use-cases/index.js';
import { validate } from '../../../infrastructure/http/validate.js';
import { requireAuth, type AuthUser } from '../../../infrastructure/http/auth.middleware.js';
import { Credentials, PublicUserOutput } from './user.schemas.js';

/** POST /register, POST /login, GET /me. Rate limiting serré sur /login (OWASP API2). */
export function buildUserRouter(useCases: UserUseCases, opts: { jwtSecret: string; jwtIssuer: string }): Router {
  const router = Router();
  const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

  router.post('/register', validate(Credentials), async (_req, res) => {
    const user = await useCases.registerUser.execute(res.locals.body as Credentials);
    res.status(201).json(PublicUserOutput.parse(user));
  });

  router.post('/login', loginLimiter, validate(Credentials), async (_req, res) => {
    const token = await useCases.loginUser.execute(res.locals.body as Credentials);
    res.json(token);
  });

  router.get('/me', requireAuth(opts), async (_req, res) => {
    const me = await useCases.getMe.execute((res.locals.user as AuthUser).id);
    res.json(PublicUserOutput.parse(me));
  });

  return router;
}
