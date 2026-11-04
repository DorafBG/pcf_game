import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGameRepository } from '../src/contexts/infrastructure/in-memory-game.repository.js';
import { CreateGame } from '../src/contexts/use-cases/create-game.js';
import { PlayMove } from '../src/contexts/use-cases/play-move.js';
import { PlayerIdAlreadyPlayed } from '../src/contexts/domain/game.errors.js';

let repo: InMemoryGameRepository;
let createGame: CreateGame;
let playMove: PlayMove;
let gameId: string;

/** Runs before every test */
beforeEach(async () => {
    repo = new InMemoryGameRepository();
    createGame = new CreateGame(repo);
    playMove = new PlayMove(repo);

    const game = await createGame.execute({
        player1: {
            id: 'p1',
            skins: { rock: 'r1', paper: 'p1', scissors: 's1' },
            hasWell: true,
        },
        player2: {
            id: 'p2',
            skins: { rock: 'r2', paper: 'p2', scissors: 's2' },
            hasWell: false,
        },
    })

    gameId = game.id;
})

describe('Winning round', () => {
    it("should award 1 point to Player 1 when rock beats scissors",
        async () => {
            await playMove.execute({ gameId, playerId: 'p1', move: 'rock' });
            const res = await playMove.execute({ gameId, playerId: 'p2', move: 'scissors' });
            expect(res.score).toEqual([1, 0]);
            expect(res.round).toBe(2);
            expect(res.currentRound).toEqual({});
        });
})

describe('Tie round', () => {
    it("should award no point to Player 1 and Player 2 when playing same move",
        async () => {
            await playMove.execute({ gameId, playerId: 'p1', move: 'rock' });
            const res = await playMove.execute({ gameId, playerId: 'p2', move: 'rock' });
            expect(res.score).toEqual([0, 0]);
            expect(res.round).toBe(2);
            expect(res.currentRound).toEqual({});
        });
})

describe('Cannot play twice', () => {
    it("should refuse the second consecutive move from Player 1 in a round",
        async () => {
            await playMove.execute({ gameId, playerId: 'p1', move: 'well' });
            await expect(playMove.execute({ gameId, playerId: 'p1', move: 'rock' })).rejects.toThrow(PlayerIdAlreadyPlayed);
        });
})

describe('Victory condition', () => {
    it("should set Player 1 as the winner of the game",
        async () => {
            await playMove.execute({ gameId, playerId: 'p1', move: 'well' });
            await playMove.execute({ gameId, playerId: 'p2', move: 'scissors' });
            await playMove.execute({ gameId, playerId: 'p1', move: 'scissors' });
            await playMove.execute({ gameId, playerId: 'p2', move: 'paper' });
            await playMove.execute({ gameId, playerId: 'p1', move: 'scissors' });
            const res = await playMove.execute({ gameId, playerId: 'p2', move: 'paper' });
            expect(res.score).toEqual([3, 0]);
            expect(res.round).toBe(4);
            expect(res.gameStatus).toEqual('finished');
            expect(res.winnerId).toEqual('p1');
        });
})