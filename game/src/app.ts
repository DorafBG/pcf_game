import express from 'express';
import type { Router } from 'express';
import { errorHandler } from './infrastructure/http/error-handler.js';
import { buildGameRouter } from './contexts/infrastructure/game.routes.js';
import { buildGameUseCases, type GamePorts } from './contexts/use-cases/index.js';

export function buildApp(games: GamePorts, docs?: Router) {
    const app = express();
    app.use(express.json());

    app.get('/health', (_req, res) => { res.json({ status: 'ok', service: 'game', uptime: process.uptime() }); });
    if (docs) app.use('/docs', docs);

    app.use('/api/v1/game', buildGameRouter(buildGameUseCases(games)));
    app.use((req, res) => {
        res.status(404).type('application/problem+json').json({ title: 'Not Found', status: 404, instance: req.originalUrl });
    });
    app.use(errorHandler);
    return app;
}