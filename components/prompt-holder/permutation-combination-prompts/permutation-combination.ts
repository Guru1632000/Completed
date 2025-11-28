/**
 * Generates a prompt for Permutation and Combination questions.
 * Note: Each question is logically independent.
 */
const PERMUTATION_COMBINATION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Permutation and Combination questions. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a mix of:
1.  **Permutations (Arrangements):**
    -   Arranging people in a line.
    -   Forming numbers with given digits (with/without repetition).
    -   Arranging letters of a word (with/without repeated letters).
2.  **Combinations (Selections):**
    -   Forming a committee/team from a group of people.
    -   Selecting items (e.g., balls, cards) from a collection.
    -   Problems with constraints (e.g., "at least", "at most", "a particular person is always included").

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Direct application of nPr or nCr formulas with small numbers.
-   **For 'Moderate' difficulty:** Problems involving simple constraints or arranging letters of a word with repeated letters.
-   **For 'Hard' difficulty:** Complex committee selection problems with multiple constraints, or geometric problems (e.g., number of triangles from collinear points).
-   **For 'Mixed' difficulty:** A mix of Permutation and Combination questions of Easy and Moderate difficulty.

**Example Questions to Model After:**

Q1. In how many different ways can the letters of the word 'LEADING' be arranged in such a way that the vowels always come together? (Ans: 720)
Q2. From a group of 7 men and 6 women, five persons are to be selected to form a committee so that at least 3 men are there on the committee. In how many ways can it be done? (Ans: 756)
Q3. How many 3-digit numbers can be formed from the digits 2, 3, 5, 6, 7 and 9, which are divisible by 5 and none of the digits is repeated? (Ans: 20)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly state whether it's a permutation or combination problem, state the formula used (nPr or nCr), and show the calculation.
`;

export const getPermutationCombinationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return PERMUTATION_COMBINATION_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
