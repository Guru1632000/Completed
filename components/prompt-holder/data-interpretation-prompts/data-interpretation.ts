import { TABULAR_DI_PROMPT } from './tabular-di';
import { BAR_GRAPH_DI_PROMPT } from './bar-graph-di';
import { LINE_GRAPH_DI_PROMPT } from './line-graph-di';
import { PIE_CHART_DI_PROMPT } from './pie-chart-di';
import { CASELET_DI_PROMPT } from './caselet-di';
import { MISSING_DI_PROMPT } from './missing-di';
import { MIXED_GRAPH_DI_PROMPT } from './mixed-graph-di';
import { RADAR_GRAPH_DI_PROMPT } from './radar-graph-di';
import { LOGICAL_DI_PROMPT } from './logical-di';

// Define prompt pools based on difficulty, as per user request.
const easyMediumPrompts = [
    TABULAR_DI_PROMPT,
    BAR_GRAPH_DI_PROMPT,
    LINE_GRAPH_DI_PROMPT,
    PIE_CHART_DI_PROMPT,
];

const mediumHardPrompts = [
    CASELET_DI_PROMPT,
    PIE_CHART_DI_PROMPT,
    MIXED_GRAPH_DI_PROMPT,
    MISSING_DI_PROMPT,
    LOGICAL_DI_PROMPT,
];

const hardOnlyPrompts = [
    RADAR_GRAPH_DI_PROMPT,
    // Add complex missing DI here again to increase its probability for hard tests
    MISSING_DI_PROMPT,
];

// Create combined, unique lists for different difficulty levels.
const easyPool = easyMediumPrompts;
const mediumPool = Array.from(new Set([...easyMediumPrompts, ...mediumHardPrompts]));
const hardPool = Array.from(new Set([...mediumHardPrompts, ...hardOnlyPrompts]));
const mixedPool = Array.from(new Set([...easyPool, ...mediumPool, ...hardPool]));


/**
 * Generates a prompt for a random type of Data Interpretation puzzle.
 * This function dynamically selects one of the specialized prompt templates
 * based on the requested difficulty, ensuring variety and an appropriate challenge level.
 */
export const getDataInterpretationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    let selectedTemplatePool: string[];
    const lowerCaseDifficulty = difficultyInstruction.toLowerCase();

    // Select the appropriate pool of DI types based on the difficulty instruction.
    if (lowerCaseDifficulty.includes('easy')) {
        selectedTemplatePool = easyPool;
    } else if (lowerCaseDifficulty.includes('medium')) {
        selectedTemplatePool = mediumPool;
    } else if (lowerCaseDifficulty.includes('hard')) {
        selectedTemplatePool = hardPool;
    } else { // Includes 'Mixed' or any other fallback case.
        selectedTemplatePool = mixedPool;
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