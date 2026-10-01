FROM node:22-alpine

WORKDIR /app

# on copie le fichier qui cite tts les dependances du projet
COPY package.json ./

# on installe les dependances 
RUN npm install

# on copie la config du projet, le code source et les fichiers publics
COPY tsconfig.json ./
COPY src ./src
COPY public ./public

#le port sur lequel l'application va tourner
EXPOSE 3000

#on demarre l'appli en mode dev
CMD ["npm", "run", "dev"]
