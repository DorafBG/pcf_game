import { z } from 'zod';

export const PlayerConfigSchema = z.object({
    id: z.string(),
    skins: z.object({
        rock: z.string(),
        paper: z.string(),
        scissors: z.string(),
    }),
    hasWell: z.boolean(),
})

export const GameParameters = z.object({
    player1: PlayerConfigSchema,
    player2: PlayerConfigSchema,
});
export type GameParameters = z.infer<typeof GameParameters>