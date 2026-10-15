import { Router } from 'express';
import { GameParameters } from './game.schemas.js';
import { GameUseCases } from '../use-cases/index.js';
import { validate } from '../../infrastructure/http/validate.js';

/** POST /create */
export function buildGameRouter(useCases: GameUseCases): Router {
    const router = Router();

    router.post('/', validate(GameParameters), async (_req, res) => {
        const game = await useCases.createGame.execute(res.locals.body as GameParameters);
        res.status(201).json(game);
    });

    return router;
}