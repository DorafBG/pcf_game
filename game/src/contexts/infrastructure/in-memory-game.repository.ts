import { randomUUID } from 'node:crypto';
import { GameRepository } from '../domain/game.repository.js'
import { Game, GameStatus, NewGame, CurrentRound } from '../domain/game.js';

export class InMemoryGameRepository implements GameRepository {
    private readonly games = new Map<string, Game>();
    async findById(id: string): Promise<Game | null> {
        return this.games.get(id) ?? null;
    }
    async create(input: NewGame): Promise<Game> {
        const game: Game = { id: randomUUID(), ...input, score: [0, 0], round: 1, gameStatus: 'inProgress', currentRound: {} }
        this.games.set(game.id, game);
        return game;
    }
}