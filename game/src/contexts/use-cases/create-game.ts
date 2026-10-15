import { NewGame } from "../domain/game.js";
import type { GameRepository } from "../domain/game.repository.js";

export class CreateGame {
    constructor(private readonly games: GameRepository) { }

    async execute(input: NewGame) {
        const game = await this.games.create(input);
        return game;
    }
}