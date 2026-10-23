import { type GameRepository } from "../domain/game.repository.js";
import { type Move } from "../domain/game.js";
import { InvalidGameId } from "../domain/game.errors.js";
import { playMove } from "../domain/game-rules.js";

export interface PlayMoveInput {
    gameId: string;
    playerId: string;
    move: Move;
}

export class PlayMove {
    constructor(private readonly games: GameRepository) { }

    async execute(input: PlayMoveInput) {
        /** Fetch : retrieve the game across the repository */
        const game = await this.games.findById(input.gameId);
        if (!game) throw new InvalidGameId();

        /** Mutate : update game */
        const updatedGame = playMove(game, input.playerId, input.move);

        /** Persist : save the new game state */
        await this.games.save(updatedGame);

        /** Return : return the new game */
        return updatedGame;
    }
}