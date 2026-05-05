import type { Dictionary } from "../domain/ports/Dictionary.ts";
import type { Word } from "../domain/models/types.ts";

export class RealDictionary implements Dictionary {
    // Cache words to avoid repeated fetches
    private cachedWords: string[] | null = null;

    private async fetchWords(): Promise<string[]> {
        if (this.cachedWords) {
            return this.cachedWords;
        }

        try {
            const response = await fetch('/words.json');

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data: string[] = await response.json();

            // Enforce uppercase to prevent case issues
            this.cachedWords = data.map(word => word.toUpperCase());

            return this.cachedWords;
        } catch (error) {
            console.error("Failed to fetch dictionary:", error);
            // Safe fallback if network fails
            return ["ARBRE", "LIVRE"];
        }
    }

    async isValidWord(word: string): Promise<boolean> {
        const words = await this.fetchWords();
        return words.includes(word.toUpperCase());
    }

    async getRandomWord(difficulty: 'EASY' | 'NORMAL' | 'HARD' = 'NORMAL'): Promise<Word> {
        const words = await this.fetchWords();
        
        let filteredWords = words;
        
        if (difficulty === 'EASY') {
            // Mots simples : pas de lettres rares (Z, X, Y, K, W)
            filteredWords = words.filter(w => !/[ZXYKW]/.test(w));
        } else if (difficulty === 'HARD') {
            // Mots complexes : au moins une lettre rare
            filteredWords = words.filter(w => /[ZXYKW]/.test(w));
        }

        // Fallback si le filtre est trop restrictif
        if (filteredWords.length === 0) filteredWords = words;

        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        return filteredWords[randomIndex] as Word;
    }
}
