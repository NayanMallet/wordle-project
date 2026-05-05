import type { EvaluatedLetter, LetterFeedback } from "../models/types.ts";
import { InvalidWordError } from "../models/errors.ts";

export function evaluateGuess(secret: string, guess: string): EvaluatedLetter[] {
    if (guess.length !== secret.length) {
        throw new InvalidWordError(guess);
    }

    const result: EvaluatedLetter[] = [];
    const secretLettersPool = secret.split('');

    // First pass: Find all CORRECT letters and consume them in the pool
    for (let i = 0; i < guess.length; i++) {
        let feedback: LetterFeedback = "ABSENT";

        if (guess[i] === secretLettersPool[i]) {
            feedback = "CORRECT";
            secretLettersPool[i] = "*";
        }

        result.push({ letter: guess[i], feedback });
    }

    // Second pass: Find MISPLACED letters from the remaining unconsumed pool
    for (let i = 0; i < guess.length; i++) {
        if (result[i].feedback === "ABSENT") {
            const poolIndex = secretLettersPool.indexOf(guess[i]);

            if (poolIndex !== -1) {
                result[i].feedback = "MISPLACED";
                secretLettersPool[poolIndex] = "*";
            }
        }
    }

    return result;
}