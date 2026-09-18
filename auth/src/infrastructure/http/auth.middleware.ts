import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export type Role = 'user' | 'admin';
export interface AuthUser { id: string; role: Role }

const problem = (status: number, title: string, detail?: string) => ({
  type: `https://polyshop.fr/problems/${title.toLowerCase().replace(/\s+/g, '-')}`,
  title,
  status,
  ...(detail ? { detail } : {}),
});

/**
 * Vérifie le Bearer JWT et dépose l'utilisateur dans res.locals.user.
 * Fichier partagé : identique dans auth, product, cart (Exercises/shared/http/auth.middleware.ts).
 */
export const requireAuth = (opts: { jwtSecret: string; jwtIssuer: string }): RequestHandler => (req, res, next) => {
  const header = req.get('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
  if (!token) {
    res.status(401).set('WWW-Authenticate', 'Bearer').type('application/problem+json').json(problem(401, 'Unauthorized', 'Missing bearer token'));
    return;
  }
  try {
    const payload = jwt.verify(token, opts.jwtSecret, { issuer: opts.jwtIssuer, algorithms: ['HS256'] }) as jwt.JwtPayload;
    if (typeof payload.sub !== 'string') throw new Error('missing sub');
    res.locals.user = { id: payload.sub, role: (payload.role as Role) ?? 'user' } satisfies AuthUser;
    next();
  } catch {
    res.status(401).set('WWW-Authenticate', 'Bearer error="invalid_token"').type('application/problem+json').json(problem(401, 'Unauthorized', 'Invalid or expired token'));
  }
};

/** Autorisation par rôle (RBAC). Le contrôle de propriété (BOLA) se fait dans les cas d'usage. */
export const requireRole = (...roles: Role[]): RequestHandler => (_req, res, next) => {
  const user = res.locals.user as AuthUser | undefined;
  if (!user || !roles.includes(user.role)) {
    res.status(403).type('application/problem+json').json(problem(403, 'Forbidden', `Requires role: ${roles.join(' | ')}`));
    return;
  }
  next();
};
