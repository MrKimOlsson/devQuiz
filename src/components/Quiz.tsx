import { useEffect, useState } from 'react';
import { fetchQuestions, fetchRandomQuestions } from '../services/quizService'; // Import both fetch functions
import { Question } from '../types/quiztypes';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Quiz.css';

interface QuizProps {
    category: string; // category is no longer nullable, it will always have a value
    difficulty: string;
    onRestart: () => void;
}

const Quiz: React.FC<QuizProps> = ({ category, difficulty, onRestart }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [userResults, setUserResults] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);

    // Function to load questions based on the category (either random or specific)
    const loadQuestions = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check if category is "Random"
            if (category === 'Random') {
                // Fetch random questions
                const data = await fetchRandomQuestions(10); 
                setQuestions(data);
            } else {
                // Fetch questions based on specified category, difficulty, and limit
                const data = await fetchQuestions('', difficulty, 10, category);
                setQuestions(data);     // Store fetched questions in state
                setFinished(false);     // Reset finished state for quiz retries
                setCurrentQuestionIndex(0);  // Start from the first question
                setUserAnswers([]);     // Clear previous user answers
                setUserResults([]);     // Clear previous results (correct/incorrect)
            }
        } catch (err: any) {
            setError('Failed to fetch questions: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load questions when category or difficulty changes
    useEffect(() => {
        loadQuestions();
    }, [category, difficulty]);

    const currentQuestion = questions[currentQuestionIndex];

    // Handle user's answer click and move to next question
    const handleAnswerClick = (answerKey: string) => {
        const isCorrect = currentQuestion.correct_answers[`${answerKey}_correct`] === "true";
        setUserAnswers((prev) => [...prev, answerKey]);
        setUserResults((prev) => [...prev, isCorrect]);

        // Move to next question or finish quiz
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setFinished(true);
        }
    };

    // Function to try again (reload questions)
    const handleTryAgain = () => {
        loadQuestions(); // Reload questions and reset quiz state
    };

    // Function to restart the quiz with the same parameters
    const handleRestart = () => {
        onRestart(); // Call parent-provided function to reset quiz settings
    };

    // Display loading state while fetching questions
    if (loading) return <div>Loading...</div>;

    // Display error message if there's an issue fetching questions
    if (error) return <div>{error}</div>;

    // Render the questions or results based on the quiz state
    const renderQuestions = () => (
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="question">{currentQuestion.question}</h3>
            <ul className="answer-list">
                {Object.entries(currentQuestion.answers).map(([key, answer]) =>
                    answer ? (
                        <li key={key} className="answer-item" onClick={() => handleAnswerClick(key)}>
                            {answer}
                        </li>
                    ) : null
                )}
            </ul>
            <button onClick={handleRestart} className="restart-button">Restart Quiz</button>
        </motion.div>
    );

    const renderResults = () => (
        <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1>Quiz Results</h1>
            <h2>Your Score: {userAnswers.filter((_, index) => userResults[index]).length} out of {questions.length}</h2>
            <ul className="answer-list">
                {questions.map((question, index) => {
                    const userAnswerKey = userAnswers[index];
                    const correctAnswerKey = Object.keys(question.correct_answers).find(key => question.correct_answers[key] === "true");

                    const userAnswerText = question.answers[userAnswerKey] || 'No answer selected';
                    const correctAnswerText = correctAnswerKey ? question.answers[correctAnswerKey.replace('_correct', '')] : 'No correct answer';

                    const isCorrect = userResults[index];

                    return (
                        <li key={index} className="result-item">
                            <h3>{question.question}</h3>
                            <p>Your Answer: {userAnswerText}</p>
                            <p>Correct Answer: {correctAnswerText}</p>
                            <FontAwesomeIcon
                                icon={isCorrect ? faCheckCircle : faTimesCircle}
                                className={isCorrect ? 'correct' : 'incorrect'}
                            />
                        </li>
                    );
                })}
            </ul>
            <button onClick={handleTryAgain} className="try-again-button">Try Again</button>
            <button onClick={handleRestart} className="restart-button">Restart Quiz</button>
        </motion.div>
    );

    return (
        <div className="quiz-container">
            <h1>Quiz on {category}</h1>
            <AnimatePresence mode="wait">
                {finished ? renderResults() : renderQuestions()}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;