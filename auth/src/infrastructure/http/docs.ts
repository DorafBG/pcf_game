import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';

/** Sert la documentation OpenAPI (docs/openapi.yaml) sur /docs et le YAML brut sur /docs/openapi.yaml. */
export async function buildDocsRouter(): Promise<Router> {
  const file = path.resolve(import.meta.dirname, '../../../docs/openapi.yaml');
  const raw = await readFile(file, 'utf8');
  const spec = parse(raw) as Record<string, unknown>;
  const router = Router();
  router.get('/openapi.yaml', (_req, res) => { res.type('text/yaml').send(raw); });
  router.use('/', swaggerUi.serve, swaggerUi.setup(spec));
  return router;
}
