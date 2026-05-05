import type { Word } from "../models/types.ts";

export interface Dictionary {
    isValidWord(word: string): Promise<boolean>;
    getRandomWord(): Promise<Word>;
}