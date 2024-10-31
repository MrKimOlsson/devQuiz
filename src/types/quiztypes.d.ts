export interface Answer {
    answer_a?: string;
    answer_b?: string;
    answer_c?: string;
    answer_d?: string;
    answer_e?: string;
    answer_f?: string;
    [key: string]: string | undefined;
}

export interface Question {
    id: number;
    question: string;
    answers: Answer;
    correct_answers: Record<string, string>;
    difficulty: string;
}
