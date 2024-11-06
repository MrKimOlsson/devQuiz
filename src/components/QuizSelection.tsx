import React, { useState } from 'react';
import Quiz from './Quiz';

// Import images from the assets folder for each category
import JavaScriptImage from '@assets/js.png';
import HTMLImage from '@assets/html.png';
import PHPImage from '@assets/php.png';
import LaravelImage from '@assets/laravel.png';
import PythonImage from '@assets/python.png';
import DockerImage from '@assets/docker.png';
import RandomImage from '@assets/random.png';


// Define available quiz categories
type Category = 'JavaScript' | 'HTML' | 'PHP' | 'Laravel' | 'Python' | 'Docker' | 'Random';

// Define available difficulties for each category
const categories: Record<Category, string[]> = {
    JavaScript: ['easy'],
    HTML: ['easy', 'medium', 'hard'],
    PHP: ['easy', 'medium', 'hard'],
    Laravel: ['easy'],
    Python: ['easy', 'medium'],
    Docker: ['easy', 'medium', 'hard'],
    Random: ['random'],
};

// Define corresponding images for each category
const categoryImages: Record<Category, string> = {
    JavaScript: JavaScriptImage,
    HTML: HTMLImage,
    PHP: PHPImage,
    Laravel: LaravelImage,
    Python: PythonImage,
    Docker: DockerImage,
    Random: RandomImage,
};

// Main QuizSelection component for category and difficulty selection
const QuizSelection: React.FC = () => {
    // State to store selected category
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    
    // State to store selected difficulty
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    
    // State to store available difficulties for the selected category
    const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);

    // Function to handle selecting a category
    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);                     // Update selected category
        setSelectedDifficulty(null);                       // Reset difficulty selection
        setAvailableDifficulties(categories[category]);    // Update available difficulties based on category
    };

    // Function to handle selecting a difficulty level
    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);                 // Set selected difficulty
    };

    // Function to reset the category and difficulty selection
    const handleRestart = () => {
        setSelectedCategory(null);                         // Reset selected category
        setSelectedDifficulty(null);                       // Reset selected difficulty
        setAvailableDifficulties([]);                      // Clear available difficulties
    };

    return (
        <div>
            {/* Render category selection if no category has been selected */}
            {!selectedCategory ? (
                <div className="category-selection">
                    <h1 className='text-outline'>Select a Quiz</h1>
                    <div className="category-cards">
                        {Object.keys(categories).map((category) => (
                            <div 
                                key={category} 
                                className="category-card"
                                onClick={() => handleCategorySelect(category as Category)}   // Handle category selection on click
                            >
                                <div className='category-image-container'>
                                    {/* Display the image associated with each category */}
                                    <img src={categoryImages[category as Category]} alt={`${category} example`} className="category-image" />
                                </div>
                                <h1 className='text-outline'>{category}</h1>
                                <p>Difficulty Levels: {categories[category as Category].join(', ')}</p>  {/* Display difficulty levels for each category */}
                            </div>
                        ))}
                    </div>
                </div>
            ) : !selectedDifficulty ? (
                // Render difficulty selection if category is selected but no difficulty selected
                <div>
                    <h1 className='text-outline'>Select Difficulty</h1>
                    {availableDifficulties.length > 0 ? (
                        availableDifficulties.map((difficulty) => (
                            <button 
                                key={difficulty} 
                                onClick={() => handleDifficultySelect(difficulty)}   // Handle difficulty selection on click
                                className="difficulty-button"
                            >
                                {/*  Capitalize first letter of difficulty */}
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}  
                            </button>
                        ))
                    ) : (
                        //  Display if no difficulties are available
                        <p>No available difficulties for this category.</p>  
                    )}
                    <button onClick={handleRestart} className="restart-button">Restart Selection</button>  {/* Button to reset selection */}
                </div>
            ) : (
                // Render the Quiz component if both category and difficulty are selected
                <div>
                    <Quiz category={selectedCategory} difficulty={selectedDifficulty} onRestart={handleRestart} />
                </div>
            )}
        </div>
    );
};

export default QuizSelection;
