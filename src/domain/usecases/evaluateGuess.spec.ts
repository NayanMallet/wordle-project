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

    it('Given a guess with exact match, When evaluated, Then all letters are CORRECT', () => {
        // GIVEN: A secret word
        const secret = "ARBRE";

        // WHEN: The exact same word is guessed
        const result = evaluateGuess(secret, "ARBRE");

        // THEN: All letters return CORRECT
        expect(result).toEqual([
            { letter: "A", feedback: "CORRECT" },
            { letter: "R", feedback: "CORRECT" },
            { letter: "B", feedback: "CORRECT" },
            { letter: "R", feedback: "CORRECT" },
            { letter: "E", feedback: "CORRECT" },
        ]);
    });

    it('Given a guess with mixed feedback, When evaluated, Then it returns CORRECT, MISPLACED and ABSENT correctly', () => {
        // GIVEN: A secret word "PORTE"
        const secret = "PORTE";

        // WHEN: Guessing "POSTE" (P, O, T, E correct, S absent)
        const result = evaluateGuess(secret, "POSTE");

        // THEN: Feedback perfectly reflects the mix
        expect(result).toEqual([
            { letter: "P", feedback: "CORRECT" },
            { letter: "O", feedback: "CORRECT" },
            { letter: "S", feedback: "ABSENT" },
            { letter: "T", feedback: "CORRECT" },
            { letter: "E", feedback: "CORRECT" },
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
            { letter: "R", feedback: "MISPLACED" },
            { letter: "A", feedback: "ABSENT" },
            { letter: "M", feedback: "ABSENT" },
            { letter: "E", feedback: "MISPLACED" },
            { letter: "R", feedback: "ABSENT" },
        ]);
    });

    it('Given a guess with 3 identical letters but secret has only 1, When evaluated, Then only the first matches and others are ABSENT', () => {
        // GIVEN: Secret has one 'R' and one 'E'
        const secret = "ROUGE";
        const guess = "ERREU"; // 2 'E's and 2 'R's

        // WHEN: Evaluated
        const result = evaluateGuess(secret, guess);

        // THEN: Only one E and one R are marked as MISPLACED, the rest are ABSENT
        expect(result).toEqual([
            { letter: "E", feedback: "MISPLACED" },
            { letter: "R", feedback: "MISPLACED" },
            { letter: "R", feedback: "ABSENT" },
            { letter: "E", feedback: "ABSENT" },
            { letter: "U", feedback: "MISPLACED" },
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