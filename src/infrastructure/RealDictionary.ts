import type { Dictionary } from "../domain/ports/Dictionary.ts";
import type { Word } from "../domain/models/types.ts";

export class RealDictionary implements Dictionary {
    // Cache words to avoid repeated fetches
    private cachedWords: string[] | null = null;

    // Handles the network request
    private async fetchWords(): Promise<string[]> {
        if (this.cachedWords) {
            return this.cachedWords;
        }

        try {
            // Fetch from local JSON or external API
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

    async getRandomWord(): Promise<Word> {
        const words = await this.fetchWords();
        const randomIndex = Math.floor(Math.random() * words.length);

        return words[randomIndex] as Word;
    }
}