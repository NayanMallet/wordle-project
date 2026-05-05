import type {GameState} from "./types.ts";

export class InvalidWordError extends Error {
    constructor(word: string) {
        super(`"${word}" is not a valid 5-letter word.`);
        this.name = "InvalidWordError";
    }
}
export class GameOverError extends Error {
    constructor(gameState: GameState) {
        super(`The game is already ${gameState}.`);
        this.name = "GameOverError";
    }
}