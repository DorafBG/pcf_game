import { GameRepository } from "../domain/game.repository.js";
import { CreateGame } from "./create-game.js";

export interface GamePorts { games: GameRepository }

export function buildGameUseCases({ games }: GamePorts) {
    return {
        createGame: new CreateGame(games),
    };
}

export type GameUseCases = ReturnType<typeof buildGameUseCases>;