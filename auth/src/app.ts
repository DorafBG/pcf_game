import express from 'express';
import type { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { buildUserUseCases, type UserPorts } from './contexts/user/use-cases/index.js';
import { buildUserRouter } from './contexts/user/infrastructure/user.routes.js';
import { errorHandler } from './infrastructure/http/error-handler.js';

export interface AppDeps extends UserPorts {
  jwtSecret: string;
  jwtIssuer: string;
  corsOrigins: string[];
  docs?: Router;
}

export function buildApp({ users, hasher, tokens, jwtSecret, jwtIssuer, corsOrigins, docs }: AppDeps) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => { res.json({ status: 'ok', service: 'auth', uptime: process.uptime() }); });

  app.use('/api/v1/auth', buildUserRouter(buildUserUseCases({ users, hasher, tokens }), { jwtSecret, jwtIssuer }));
  if (docs) app.use('/docs', docs);

  app.use((req, res) => {
    res.status(404).type('application/problem+json').json({ title: 'Not Found', status: 404, instance: req.originalUrl });
  });
  app.use(errorHandler);
  return app;
}
