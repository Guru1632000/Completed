import * as seatingPrompts from './seating-arrangement-prompts';
import * as puzzlePrompts from './puzzle-prompts';

// Define prompt pools for generic/fallback puzzles only.
const easyPuzzlePrompts = [
    puzzlePrompts.MIXED_VARIABLE_PUZZLE_PROMPT,
    puzzlePrompts.COMPARISON_INEQUALITY_PROMPT, // Good for "Ranking"
];

const mediumPuzzlePrompts = [
    ...easyPuzzlePrompts,
];

const hardPuzzlePrompts = [
    ...mediumPuzzlePrompts,
];

const allPuzzlePrompts = hardPuzzlePrompts;

/**
 * Generates a prompt for a random type of generic Logic Puzzle.
 * This function serves as a fallback for keywords like 'puzzle', 'ranking', or 'mixed variable'.
 */
export const getPuzzlePrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    let selectedTemplatePool: string[];
    const lowerCaseDifficulty = difficultyInstruction.toLowerCase();

    // Select the appropriate pool of puzzle types based on the difficulty instruction.
    if (lowerCaseDifficulty.includes('easy')) {
        selectedTemplatePool = easyPuzzlePrompts;
    } else if (lowerCaseDifficulty.includes('medium')) {
        selectedTemplatePool = mediumPuzzlePrompts;
    } else if (lowerCaseDifficulty.includes('hard')) {
        selectedTemplatePool = hardPuzzlePrompts;
    } else { // Includes 'Mixed' or any other fallback case.
        selectedTemplatePool = allPuzzlePrompts;
    }

    // Select a random prompt template from the chosen pool.
    const selectedTemplate = selectedTemplatePool[Math.floor(Math.random() * selectedTemplatePool.length)];
    
    // Substitute placeholders with actual values.
    const finalPrompt = selectedTemplate
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
    
    return finalPrompt;
};