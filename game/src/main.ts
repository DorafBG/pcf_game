import { config } from "./config.js";
import { buildApp } from "./app.js";
import { buildDocsRouter } from "./infrastructure/http/docs.js";
import { InMemoryGameRepository } from "./contexts/infrastructure/in-memory-game.repository.js";

const app = buildApp({ games: new InMemoryGameRepository() });

const server = app.listen(config.PORT, () => {
    console.log(`game listening on http://localhost:${config.PORT} - docs on /docs`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, () => {
        server.close(async () => { process.exit(0); });
    });
}