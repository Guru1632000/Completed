
/**
 * This file contains a modular and intelligent prompt generation system for
 * all "Time, Speed, and Distance" (TSD) related questions. It uses specific
 * prompt templates for different sub-topics and selects the appropriate one
 * based on context or difficulty.
 */
import { RELATIVE_SPEED_TRAINS_PROMPT } from './trains-towards-each-other';
import { AVERAGE_SPEED_PROMPT } from './average-speed';


/**
 * Fallback prompt for general 'Time, Speed, and Distance' word problems.
 * This covers scenarios like late/early arrivals, stoppages, and basic calculations.
 */
const GENERAL_TSD_PROMPT = `
**Objective:** Generate a high-quality, exam-style question set with exactly \${numberOfQuestions} questions on general Time, Speed, and Distance concepts.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** Each question should be a standalone word problem.

**Specific Task Requirements:**
-   **Scenario Variety:** Generate a mix of the following common TSD scenarios:
    1.  **Late/Early Problems:** A person reaches late at one speed and early at another. Find the distance or correct time.
    2.  **Stoppage Problems:** Calculating stoppage time per hour based on speeds with and without stoppages.
    3.  **Basic TSD calculations:** Finding time, speed, or distance with one or two moving objects.
-   **Explanation:** The explanation for each question **must** clearly define the variables, state the formulas used (Distance = Speed × Time), and show the step-by-step algebraic solution.

**Example Questions to Model After:**

Q1 (Late/Early): A train travels at 60 km/h and reaches its destination 15 minutes late. If it travels at 80 km/h, it reaches 10 minutes early. Find the distance to the destination.

Q2 (Stoppage): Excluding stoppages, the speed of a bus is 54 km/h, and including stoppages, it is 45 km/h. For how many minutes does the bus stop per hour?

**Your Task:**
Create **new and unique** questions based on the specified requirements. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;

// A mapping of keywords to their specialized prompt templates.
const tsdPromptMap = [
  {
    keywords: ['train', 'overtake', 'cross each other', 'relative speed'],
    template: RELATIVE_SPEED_TRAINS_PROMPT,
  },
  {
    keywords: ['average speed'],
    template: AVERAGE_SPEED_PROMPT,
  },
];

/**
 * Generates the final prompt for "Time, Speed, and Distance" questions.
 * It intelligently selects a specific prompt if sub-topic keywords are found in the context.
 * Otherwise, it defaults to a general prompt. (Note: Boats & Streams are handled separately by the aiService).
 */
export const getTimeSpeedDistancePrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    const contextLower = syllabusContextPrompt.toLowerCase();

    const specificPrompt = tsdPromptMap.find(p => p.keywords.some(kw => contextLower.includes(kw)));
    
    const selectedTemplate = specificPrompt ? specificPrompt.template : GENERAL_TSD_PROMPT;

    return selectedTemplate
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
