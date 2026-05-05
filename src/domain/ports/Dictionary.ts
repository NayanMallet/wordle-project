import type { Word } from "../models/types.ts";

export interface Dictionary {
    isValidWord(word: string): Promise<boolean>;
    getRandomWord(difficulty?: 'EASY' | 'NORMAL' | 'HARD'): Promise<Word>;
}