import { useEffect, useState } from 'react';
import { fetchQuestions } from '../services/quizService';
import { Question } from '../types/quiztypes';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Quiz.css';

interface QuizProps {
    category: string;
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

    useEffect(() => {
        const getQuestions = async () => {
            setLoading(true); // Set loading to true before fetching questions
            try {
                const data = await fetchQuestions('', difficulty, 10, category);
                setQuestions(data);
            } catch (err: any) {
                setError('Failed to fetch questions: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        getQuestions();
    }, [category, difficulty]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerClick = (answerKey: string) => {
        const isCorrect = currentQuestion.correct_answers[`${answerKey}_correct`] === "true";
        setUserAnswers((prev) => [...prev, answerKey]);
        setUserResults((prev) => [...prev, isCorrect]);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setFinished(true);
        }
    };

    const handleTryAgain = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setUserResults([]);
        setFinished(false);
        setLoading(true);
        
        // Fetch questions again with the same category and difficulty
        const getQuestions = async () => {
            try {
                const data = await fetchQuestions('', difficulty, 10, category);
                setQuestions(data);
            } catch (err: any) {
                setError('Failed to fetch questions: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        getQuestions();
    };

    // New function to handle restarting
    const handleRestart = () => {
        onRestart();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="quiz-container">
            <h1>Quiz on {category}</h1>
            <AnimatePresence mode="wait">
                {finished ? (
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
                ) : (
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
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
