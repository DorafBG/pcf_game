FROM node:22-alpine

WORKDIR /app

# on copie le fichier qui cite tts les dependances du projet
COPY package.json package-lock.json* ./

# on installe les dependances 
RUN npm install

# on copie la config du projet, le schema prisma, le code source et les fichiers publics
COPY prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY public ./public

# prisma generate ne se connecte pas a la base mais exige la variable : valeur factice au build
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npx prisma generate

# le port sur lequel l'application va tourner
EXPOSE 3000

# on demarre l'appli en mode dev
CMD ["npm", "run", "dev"]
