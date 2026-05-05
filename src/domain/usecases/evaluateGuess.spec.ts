import { describe, it, expect } from 'vitest';
import { evaluateGuess } from "./evaluateGuess.ts";
import { InvalidWordError } from "../models/errors.ts";

describe('evaluateGuess', () => {

    it('Given a secret word and a totally wrong guess, When evaluated, Then all letters should be ABSENT', () => {
        // GIVEN: A secret word and a guess with no common letters
        const secret = "ARBRE";
        const guess = "CHOUX";

        // WHEN: The guess is evaluated against the secret word
        const result = evaluateGuess(secret, guess);

        // THEN: Every letter in the guess receives an "ABSENT" feedback
        expect(result).toEqual([
            { letter: "C", feedback: "ABSENT" },
            { letter: "H", feedback: "ABSENT" },
            { letter: "O", feedback: "ABSENT" },
            { letter: "U", feedback: "ABSENT" },
            { letter: "X", feedback: "ABSENT" },
        ]);
    });

    it('Given a guess with duplicate letters, When evaluated, Then extra occurrences should be ABSENT', () => {
        // GIVEN: A secret word and a guess containing duplicate letters not present in the secret
        const secret = "LIVRE";
        const guess = "RAMER";

        // WHEN: The guess is evaluated
        const result = evaluateGuess(secret, guess);

        // THEN: The specific multiple letters rule is applied (extra 'R' is ABSENT)
        expect(result).toEqual([
            { letter: "R", feedback: "MISPLACED" }, // The first R consumes the only R in LIVRE
            { letter: "A", feedback: "ABSENT" },
            { letter: "M", feedback: "ABSENT" },
            { letter: "E", feedback: "MISPLACED" },
            { letter: "R", feedback: "ABSENT" },    // The second R must be ABSENT
        ]);
    });

    it('Given a guess of invalid length, When evaluated, Then it throws an InvalidWordError', () => {
        // GIVEN: A secret word and a guess that does not match the secret's length
        const secret = "ARBRE";
        const guess = "TEST"; // Only 4 letters

        // WHEN & THEN: Evaluating the guess throws an InvalidWordError
        expect(() => evaluateGuess(secret, guess)).toThrow(InvalidWordError);
    });

});