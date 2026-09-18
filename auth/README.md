# TP3 — service `auth` (correction)

Inscription / connexion, argon2id, JWT HS256 (15 min), `GET /me`, rate limiting sur `/login`, helmet, cors.
Postgres via `@prisma/adapter-pg` (un conteneur par service).

```bash
cp .env.example .env            # DATABASE_URL vers auth-db (voir ../compose.yml)
npm install && npm run db:generate && npm run db:migrate && npm run db:seed
npm run dev                     # http://localhost:3002 — docs sur /docs
npm test
```

Routes : `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `GET /health`, `GET /docs`.
Admin de démo (seed) : `admin@polyshop.fr` / `admin-polyshop-2026`.
