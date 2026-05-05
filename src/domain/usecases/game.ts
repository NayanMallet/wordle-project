import type { Dictionary } from "../ports/Dictionary.ts";
import type { Attempt, GameState, Word } from "../models/types.ts";
import { GameOverError, InvalidWordError } from "../models/errors.ts";
import { evaluateGuess } from "./evaluateGuess.ts";

export class Game {
    private readonly dictionary: Dictionary;
    state: GameState;
    attempts: Attempt[];
    private secretWord?: Word;

    constructor(dictionary: Dictionary) {
        this.dictionary = dictionary;
        this.state = "IN PROGRESS";
        this.attempts = [];
    }

    async start(): Promise<void> {
        this.state = "IN PROGRESS";
        this.attempts = [];
        this.secretWord = await this.dictionary.getRandomWord();
    }

    async play(guess: string): Promise<void> {
        if (this.state !== "IN PROGRESS") {
            throw new GameOverError(this.state);
        }

        const isValid: boolean = await this.dictionary.isValidWord(guess);

        if (!isValid) {
            throw new InvalidWordError(guess);
        }

        const attempt: Attempt = {
            word: guess as Word,
            evaluatedLetters: evaluateGuess(this.secretWord!, guess)
        };

        this.attempts.push(attempt);

        if (attempt.evaluatedLetters.every(l => l.feedback === "CORRECT")) {
            this.state = "WON";
        } else if (this.attempts.length >= 6) {
            this.state = "LOST";
        }
    }

    getState(): GameState {
        return this.state;
    }

    getAttempts(): Attempt[] {
        return this.attempts;
    }
}