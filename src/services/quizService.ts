const API_URL = 'https://quizapi.io/api/v1/questions';
import { Question } from '../types/quiztypes';

const fetchQuestions = async (category: string, difficulty: string, limit: number = 10, tags: string = ''): Promise<Question[]> => {
    const response = await fetch(`${API_URL}?apiKey=${import.meta.env.VITE_QUIZ_API_KEY}&limit=${limit}&category=${category}&difficulty=${difficulty}&tags=${tags}`);

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const data: Question[] = await response.json();
    return data;
};


const fetchAvailableDifficulties = async (category: string): Promise<string[]> => {
    const response = await fetch(`${API_URL}?apiKey=${import.meta.env.VITE_QUIZ_API_KEY}&category=${category}`);

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    const data: Question[] = await response.json();

    const difficulties = new Set<string>(data.map((question: Question) => question.difficulty));
    return Array.from(difficulties);
};






export { fetchQuestions, fetchAvailableDifficulties };
