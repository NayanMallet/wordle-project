import { describe, it, expect } from 'vitest';
import type { Dictionary } from '../ports/Dictionary.ts';
import type { Word } from '../models/types.ts';
import { Game } from "./game.ts";
import { InvalidWordError, GameOverError } from "../models/errors.ts";

describe('Game State Management', () => {

    const createFakeDictionary = (isValid: boolean = true, randomWord: string = "ARBRE"): Dictionary => ({
        getRandomWord: async () => randomWord as Word,
        isValidWord: async (_word: string) => isValid
    });

    it('Given a new game, Then it should be IN PROGRESS with 0 attempts', async () => {
        // GIVEN: A new game instance with a fake dictionary
        const game = new Game(createFakeDictionary());

        // WHEN: The game is started
        await game.start();

        // THEN: The initial state must be "IN PROGRESS" and attempts list must be empty
        expect(game.getState()).toBe("IN PROGRESS");
        expect(game.getAttempts()).toEqual([]);
    });

    it('Given an in-progress game, When playing a word not in the dictionary, Then it throws an error and does not count as an attempt', async () => {
        // GIVEN: A started game where the dictionary rejects all words (isValid = false)
        const game = new Game(createFakeDictionary(false));
        await game.start();

        // WHEN & THEN: Playing an invalid word throws an InvalidWordError
        await expect(game.play("ZZZZZ")).rejects.toThrow(InvalidWordError);

        // THEN: The attempt is not recorded in the game history
        expect(game.getAttempts().length).toBe(0);
    });

    it('Given an in-progress game, When playing the exact secret word, Then the game is WON and the attempt is saved', async () => {
        // GIVEN: A started game with the secret word "ARBRE"
        const game = new Game(createFakeDictionary());
        await game.start();

        // WHEN: The player submits the exact secret word
        await game.play("ARBRE");

        // THEN: The game state changes to "WON" and the attempt is recorded
        expect(game.getState()).toBe("WON");
        expect(game.getAttempts().length).toBe(1);

        const lastAttempt = game.getAttempts()[0];
        expect(lastAttempt.word).toBe("ARBRE");
        expect(lastAttempt.evaluatedLetters).toEqual([
            { letter: "A", feedback: "CORRECT" },
            { letter: "R", feedback: "CORRECT" },
            { letter: "B", feedback: "CORRECT" },
            { letter: "R", feedback: "CORRECT" },
            { letter: "E", feedback: "CORRECT" },
        ]);
    });

    it('Given a finished game, When trying to play, Then it throws a GameOverError', async () => {
        // GIVEN: A game that is already finished (WON)
        const game = new Game(createFakeDictionary());
        await game.start();
        await game.play("ARBRE");
        expect(game.getState()).toBe("WON");

        // WHEN & THEN: Attempting to play again throws a GameOverError
        await expect(game.play("CHOUX")).rejects.toThrow(GameOverError);
    });

    it('Given an in-progress game, When failing 6 times, Then the game is LOST', async () => {
        // GIVEN: A started game with a specific secret word
        const game = new Game(createFakeDictionary(true, "ARBRE"));
        await game.start();

        // WHEN: The player plays 6 valid but incorrect words
        await game.play("CHIEN");
        await game.play("CHIEN");
        await game.play("CHIEN");
        await game.play("CHIEN");
        await game.play("CHIEN");
        await game.play("CHIEN");

        // THEN: The game state changes to "LOST" after the 6th attempt
        expect(game.getState()).toBe("LOST");
        expect(game.getAttempts().length).toBe(6);
    });
});