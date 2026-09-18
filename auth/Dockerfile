# syntax=docker/dockerfile:1

# ---------- 1. deps : TOUTES les dépendances (dev incluses), couche mise en cache tant que package*.json ne change pas
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. build : client Prisma + compilation TypeScript. Sert aussi de "job" de migration/seed (target: build)
FROM deps AS build
# prisma generate ne se connecte pas à la base, mais prisma.config.ts exige la variable : valeur factice au build
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
COPY prisma.config.ts tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY docs ./docs
RUN npx prisma generate && npm run build     # tsc → dist/ (client Prisma généré compris)

# ---------- 3. prod-deps : node_modules élagué (sans devDependencies)
FROM deps AS prod-deps
RUN npm prune --omit=dev

# ---------- 4. runtime : image finale minimale
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/docs ./docs
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
