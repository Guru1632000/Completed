import * as seatingPrompts from './seating-arrangement-prompts';

// Define prompt pools for seating arrangements only.
const easySeatingPrompts = [
    seatingPrompts.LINEAR_PROMPT,
    seatingPrompts.CIRCULAR_CENTER_PROMPT,
    seatingPrompts.SQUARE_PROMPT,
    seatingPrompts.DOUBLE_ROW_PROMPT,
];

const mediumSeatingPrompts = [
    ...easySeatingPrompts,
    seatingPrompts.RECTANGULAR_PROMPT,
    seatingPrompts.CIRCULAR_OUTWARD_PROMPT,
];

const hardSeatingPrompts = [
    ...mediumSeatingPrompts,
    seatingPrompts.COMPLEX_VARIABLE_PROMPT,
    seatingPrompts.CERTAIN_NUMBER_PROMPT,
];

const allSeatingPrompts = hardSeatingPrompts;

/**
 * Generates a prompt for a random type of Seating Arrangement puzzle.
 * This function dynamically selects one of the specialized seating arrangement prompt templates
 * based on the requested difficulty.
 */
export const getSeatingArrangementPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    let selectedTemplatePool: string[];
    const lowerCaseDifficulty = difficultyInstruction.toLowerCase();

    // Select the appropriate pool of puzzle types based on the difficulty instruction.
    if (lowerCaseDifficulty.includes('easy')) {
        selectedTemplatePool = easySeatingPrompts;
    } else if (lowerCaseDifficulty.includes('medium')) {
        selectedTemplatePool = mediumSeatingPrompts;
    } else if (lowerCaseDifficulty.includes('hard')) {
        selectedTemplatePool = hardSeatingPrompts;
    } else { // Includes 'Mixed' or any other fallback case.
        selectedTemplatePool = allSeatingPrompts;
    }

    // Select a random prompt template from the chosen pool.
    const selectedTemplate = selectedTemplatePool[Math.floor(Math.random() * selectedTemplatePool.length)];
    
    // Substitute placeholders with actual values.
    const finalPrompt = selectedTemplate
        .replace(/\$\{numberOfQuestions\}/g, String(numberOfQuestions))
        .replace(/\$\{syllabusContextPrompt\}/g, syllabusContextPrompt)
        .replace(/\$\{difficultyInstruction\}/g, difficultyInstruction)
        .replace(/\$\{optionsCount\}/g, String(optionsCount));
    
    return finalPrompt;
};
