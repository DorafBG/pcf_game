import { Router } from 'express';
import { GameParameters, MoveParameters } from './game.schemas.js';
import { type GameUseCases } from '../use-cases/index.js';
import { validate } from '../../infrastructure/http/validate.js';

/** POST /create */
export function buildGameRouter(useCases: GameUseCases): Router {
    const router = Router();

    router.post('/', validate(GameParameters), async (_req, res) => {
        const game = await useCases.createGame.execute(res.locals.body as GameParameters);
        res.status(201).json(game);
    });

    router.post('/:gameId/play', validate(MoveParameters), async (req, res) => {
        const game = await useCases.playMove.execute({
            gameId: req.params.gameId as string,
            ...(res.locals.body as MoveParameters),
        });
        res.status(201).json(game);
    });
    return router;
}