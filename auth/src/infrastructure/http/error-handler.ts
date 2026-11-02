import type { ErrorRequestHandler } from 'express';
import { DomainError } from '../../shared/domain-error.js';

const PROBLEM_BASE = 'https://polyshop.fr/problems/';

/** Dernier middleware : traduit les erreurs en application/problem+json (RFC 9457). */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof DomainError) {
    res.status(err.status).type('application/problem+json').json({
      type: PROBLEM_BASE + err.type,
      title: err.title,
      status: err.status,
      detail: err.message,
      instance: req.originalUrl,
    });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).type('application/problem+json').json({
      type: PROBLEM_BASE + 'malformed-json',
      title: 'Malformed JSON body',
      status: 400,
      instance: req.originalUrl,
    });
    return;
  }
  console.error(err); // stacktrace côté serveur uniquement (pino au TP4)
  res.status(500).type('application/problem+json').json({
    type: PROBLEM_BASE + 'internal',
    title: 'Internal Server Error',
    status: 500,
    instance: req.originalUrl,
  });
};
