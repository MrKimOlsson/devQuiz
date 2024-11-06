// Min applikation använder en dynamisk fetchQuestions-funktion som tillåter 
// många typer av anrop beroende på användarens val av kategori och svårighetsgrad. 
// Genom att variera parametrarna category och difficulty, 
// kan många olika typer av anrop göras för att hämtar olika data från API


// Base URL for the Quiz API
const API_URL = 'https://quizapi.io/api/v1/questions';
import { Question } from '../types/quiztypes';  // Importing Question type for type-checking API response

// Function to fetch quiz questions based on category, difficulty, limit, and tags
const fetchQuestions = async (
    category: string,            // Category of quiz questions, e.g., "JavaScript, HTML, PHP"
    difficulty: string,          // Difficulty level, e.g., "easy", "medium", "hard"
    limit: number = 10,          // Limit on the number of questions to fetch (default is 10)
    tags: string = ''            // Optional tags for more refined filtering
): Promise<Question[]> => {
    try {
        // Construct the API URL with query parameters for fetching questions
        const response = await fetch(`${API_URL}?apiKey=${import.meta.env.VITE_QUIZ_API_KEY}&limit=${limit}&category=${category}&difficulty=${difficulty}&tags=${tags}`);
        
        // Check if response is successful; if not, throw an error with the response status
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Parse the JSON response and cast to the array of Question type
        const data: Question[] = await response.json();
        return data;  // Return the fetched data
    } catch (error: any) {
        // Handle and rethrow errors with a descriptive message if the fetch fails
        throw new Error('Failed to fetch questions: ' + error.message);
    }
};



// Eftersom kravet var 2 funktioner för att API anrop så la jag även till en random fetch,
// Genom att välja alternativet "random" så användes denna funktion för att hämta ett quiz
// med blandade frågor i samtliga kategorier och svårighetsgrader

// Function to fetch random quiz questions (no category or difficulty specified)
const fetchRandomQuestions = async (limit: number = 10): Promise<Question[]> => {
    try {
        // Construct the API URL without category and difficulty (this will fetch random questions)
        const response = await fetch(`${API_URL}?apiKey=${import.meta.env.VITE_QUIZ_API_KEY}&limit=${limit}`);
        
        // Check if response is successful; if not, throw an error with the response status
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Parse the JSON response and cast to the array of Question type
        const data: Question[] = await response.json();
        console.log("Random Questions Data:");
        console.log(data);
        return data;  // Return the fetched data
    } catch (error: any) {
        // Handle and rethrow errors with a descriptive message if the fetch fails
        throw new Error('Failed to fetch random questions: ' + error.message);
    }
};

export { fetchRandomQuestions, fetchQuestions };  // Export fetch functions for use in Quiz.tsx