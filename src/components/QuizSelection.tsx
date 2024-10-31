import React, { useState } from 'react';
import Quiz from './Quiz';

// Import images from the assets folder
import JavaScriptImage from '@assets/js.png';
import HTMLImage from '@assets/html.png';
import PHPImage from '@assets/php.png';
import LaravelImage from '@assets/laravel.png';
import PythonImage from '@assets/python.png';
import DockerImage from '@assets/docker.png';

// Categories
type Category = 'JavaScript' | 'HTML' | 'PHP' | 'Laravel' | 'Python' | 'Docker';

const categories: Record<Category, string[]> = {
    JavaScript: ['easy'],
    HTML: ['easy', 'medium', 'hard'],
    PHP: ['easy', 'medium', 'hard'],
    Laravel: ['easy'],
    Python: ['easy', 'medium'],
    Docker: ['easy', 'medium', 'hard']
};

const categoryImages: Record<Category, string> = {
    JavaScript: JavaScriptImage,
    HTML: HTMLImage,
    PHP: PHPImage,
    Laravel: LaravelImage,
    Python: PythonImage,
    Docker: DockerImage
};

const QuizSelection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setSelectedDifficulty(null);
        setAvailableDifficulties(categories[category]);
    };

    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    const handleRestart = () => {
        setSelectedCategory(null);
        setSelectedDifficulty(null);
        setAvailableDifficulties([]);
    };

    return (
        <div>
            {!selectedCategory ? (
                <div className="category-selection">
                    <h1 className='text-outline'>Select a Quiz</h1>
                    <div className="category-cards">
                        {Object.keys(categories).map((category) => (
                            <div 
                                key={category} 
                                className="category-card"
                                onClick={() => handleCategorySelect(category as Category)}
                            >
                                <div className='category-image-container'>
                                    <img src={categoryImages[category as Category]} alt={`${category} example`} className="category-image" />
                                </div>
                                <h1 className='text-outline'>{category}</h1>
                                <p>Difficulty Levels: {categories[category as Category].join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : !selectedDifficulty ? (
                <div>
                    <h1 className='text-outline'>Select Difficulty</h1>
                    {availableDifficulties.length > 0 ? (
                        availableDifficulties.map((difficulty) => (
                            <button 
                                key={difficulty} 
                                onClick={() => handleDifficultySelect(difficulty)}
                                className="difficulty-button"
                            >
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </button>
                        ))
                    ) : (
                        <p>No available difficulties for this category.</p>
                    )}
                    <button onClick={handleRestart} className="restart-button">Restart Selection</button>
                </div>
            ) : (
                <div>
                    <Quiz category={selectedCategory} difficulty={selectedDifficulty} onRestart={handleRestart} />
                </div>
            )}
        </div>
    );
};

export default QuizSelection;
