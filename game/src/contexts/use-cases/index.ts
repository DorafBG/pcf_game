import { type GameRepository } from "../domain/game.repository.js";
import { CreateGame } from "./create-game.js";
import { PlayMove } from "./play-move.js";

export interface GamePorts { games: GameRepository }

export function buildGameUseCases({ games }: GamePorts) {
    return {
        createGame: new CreateGame(games),
        playMove: new PlayMove(games),
    };
}

export type GameUseCases = ReturnType<typeof buildGameUseCases>;