import { DomainError } from '../shared/domain-error.js'

export class IdenticalPlayerIds extends DomainError {
    constructor() { super('The two PlayerIds are identical', 400, 'identical-player-ids', 'Identical player ids'); }
}

export class InvalidPlayerId extends DomainError {
    constructor() { super('This playerId cannot play in this game', 400, 'invalid-player-id', 'InvalidPlayerId'); }
}

export class PlayerIdAlreadyPlayed extends DomainError {
    constructor() { super('This playerId already played this round', 400, 'player-id-already-played', 'PlayerIdAlreadyPlayed'); }
}

export class UnauthorizedMove extends DomainError {
    constructor() { super('This playerId is not authorized to play this move', 400, 'unauthorized-move', 'UnauthorizedMove'); }
}

export class FinishedGame extends DomainError {
    constructor() { super('This game is ended', 400, 'finished-game', 'FinishedGame'); }
}