import type { Game, NewGame } from "./game.js";

export interface GameRepository {
    create(input: NewGame): Promise<Game>;
    findById(id: string): Promise<Game | null>;
    save(game: Game): Promise<void>;
}