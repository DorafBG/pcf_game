import { type Game, type Move } from './game.js';
import { InvalidPlayerId, PlayerIdAlreadyPlayed, UnauthorizedMove, FinishedGame } from './game.errors.js';

type RoundWinner = 'tie' | 'player1' | 'player2';

function lowerMove(move: Move): Move[] {
    if (move == 'paper') {
        return ['rock', 'well'];
    } else if (move == 'scissors') {
        return ['paper'];
    } else if (move == 'rock') {
        return ['scissors'];
    } else {
        return ['rock', 'scissors'];
    }
};

export function resolveRoundWinner(m1: Move, m2: Move): RoundWinner {
    if (m1 == m2) {
        return 'tie';
    } else if (lowerMove(m1).includes(m2)) {
        return 'player1';
    } else {
        return "player2";
    }
};

export function canPlayMove(game: Game, playerId: string, move: Move): boolean {
    /** Check that the game is not finished */
    if (game.gameStatus == 'finished') {
        throw new FinishedGame();
    }

    /** Check that the player has the right to play in this game */
    if (playerId == game.player1.id) {
        /** Check that the player hasn't already played in this round */
        if (game.currentRound.p1Move) {
            throw new PlayerIdAlreadyPlayed();
            /** Check that the player is not playing an item he doesn't own */
        } else if (move == 'well' && !game.player1.hasWell) {
            throw new UnauthorizedMove();
        }
    } else if (playerId == game.player2.id) {
        /** Check that the player hasn't already played in this round */
        if (game.currentRound.p2Move) {
            throw new PlayerIdAlreadyPlayed();
            /** Check that the player is not playing an item he doesn't own */
        } else if (move == 'well' && !game.player2.hasWell) {
            throw new UnauthorizedMove();
        }
    } else {
        throw new InvalidPlayerId();
    }
    return true;
};

export function playMove(game: Game, playerId: string, move: Move): Game {
    if (canPlayMove(game, playerId, move)) {
        /** Play the move */
        if (playerId == game.player1.id) {
            game.currentRound.p1Move = move;
            /** Player lose his ability to play well (single usage item) */
            if (move == 'well') {
                game.player1.hasWell = false;
            }
        } else {
            game.currentRound.p2Move = move;
            /** Player lose his ability to play well (single usage item) */
            if (move == 'well') {
                game.player2.hasWell = false;
            }
        }

        /** When both players played the round */
        if (game.currentRound.p1Move && game.currentRound.p2Move) {
            /** Update the score */
            const winner: RoundWinner = resolveRoundWinner(game.currentRound.p1Move, game.currentRound.p2Move);
            if (winner == 'player1') {
                game.score[0] += 1;
            } else if (winner == 'player2') {
                game.score[1] += 1;
            }
            game.round += 1;

            /** Check the game is not ended */
            if (game.score[0] >= 3) {
                game.winnerId = game.player1.id;
                game.gameStatus = 'finished';
            } else if (game.score[1] >= 3) {
                game.winnerId = game.player2.id;
                game.gameStatus = 'finished';
                /** If the game goes beyond 10 rounds => end of the game and tie */
            } else if (game.round >= 10) {
                game.gameStatus = 'finished';
                /** The game is not ended => reset the round */
            } else {
                game.currentRound = {};
            }
        }

    }
    return game;
};