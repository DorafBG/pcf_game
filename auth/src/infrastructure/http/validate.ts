import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

type Source = 'body' | 'query' | 'params';

/**
 * Valide req[source] avec un schéma Zod. En cas d'échec : 400 problem+json.
 * La valeur nettoyée (defaults appliqués, coercition) est déposée dans res.locals[source],
 * car req.query est en lecture seule dans Express 5.
 */
export const validate =
  (schema: ZodType, source: Source = 'body'): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).type('application/problem+json').json({
        type: 'https://polyshop.fr/problems/validation',
        title: 'Validation failed',
        status: 400,
        instance: req.originalUrl,
        errors: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
      return;
    }
    res.locals[source] = result.data;
    next();
  };
