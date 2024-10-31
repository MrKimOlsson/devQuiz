// src/types/quiztypes.d.ts
export interface Answer {
    answer_a?: string;
    answer_b?: string;
    answer_c?: string;
    answer_d?: string;
    answer_e?: string;
    answer_f?: string;
    [key: string]: string | undefined; // Add this line for dynamic indexing
}

export interface Question {
    id: number;
    question: string;
    answers: Answer;
    correct_answers: Record<string, string>; // Ensure correct_answers is also defined
    difficulty: string; // Added difficulty property
}
