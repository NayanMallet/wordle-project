// Type "opaque" pour garantir qu'un mot est bien un mot de 5 lettres validé, et pas juste un string quelconque.
export type Word = string & { readonly _brand: "Word" };

export type LetterFeedback = "CORRECT" | "MISPLACED" | "ABSENT";

export type EvaluatedLetter = {
    letter: string;
    feedback: LetterFeedback;
};

export type Attempt = {
    word: Word;
    evaluatedLetters: EvaluatedLetter[];
}

export type GameState = "IN PROGRESS" | "WON" | "LOST";

