export type Move = 'rock' | 'paper' | 'scissors' | 'well';

export type GameStatus = 'inProgress' | 'finished';

export interface CurrentRound {
    p1Move?: Move;
    p2Move?: Move;
}

export interface PlayerConfig {
    id: string;
    skins: { rock: string, paper: string, scissors: string };
    hasWell: boolean;
}

export interface Game {
    id: string;
    player1: PlayerConfig;
    player2: PlayerConfig;
    score: [number, number];
    round: number;
    gameStatus: GameStatus;
    currentRound: CurrentRound;
    winnerId?: string;
}

export type NewGame = Pick<Game, 'player1' | 'player2'>;

/** Ce que le service expose : pas les inventaires des joueurs**/
/**export type PublicGame = Omit<Game, 'p1SkinId' | 'p2SkinId' | 'r1SkinId' | 'r2SkinId' | 'c1SkinId' | 'c2SkinId' | 'well1' | 'well2'>;*/
