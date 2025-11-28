/**
 * Generates a prompt for HCF (Highest Common Factor) and LCM (Lowest Common Multiple) questions.
 * Includes both direct calculations and word problems.
 * Note: Each question is logically independent.
 */
const HCF_LCM_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct HCF and LCM questions. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a mix of:
1.  **Direct Calculation:** Find the HCF or LCM of a given set of numbers or fractions.
2.  **Product/Ratio Problems:** Using the formula HCF(a, b) * LCM(a, b) = a * b.
3.  **Word Problems (HCF):** Finding the greatest number that divides X, Y, Z leaving remainders, or finding the size of the largest tile to pave a floor.
4.  **Word Problems (LCM):** Finding the least number divisible by X, Y, Z, or problems involving bells tolling together or runners on a circular track meeting.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Focus on direct calculation of HCF/LCM for 2-3 small integers.
-   **For 'Moderate' difficulty:** Involve HCF/LCM of fractions, product/ratio problems, and simple word problems.
-   **For 'Hard' difficulty:** Focus on complex word problems with remainders or multi-step scenarios.
-   **For 'Mixed' difficulty:** Generate a balanced mix of all types.

**Example Questions to Model After:**

Q1. Find the HCF of 24, 60, and 84. (Ans: 12)
Q2. Find the LCM of 12, 15, and 20. (Ans: 60)
Q3. The HCF of two numbers is 11 and their LCM is 7700. If one of the numbers is 275, find the other. (Ans: 308)
Q4. Find the greatest number that will divide 43, 91 and 183 so as to leave the same remainder in each case. (Ans: 4)
Q5. Six bells commence tolling together and toll at intervals of 2, 4, 6, 8, 10 and 12 seconds respectively. In 30 minutes, how many times do they toll together? (Ans: 16)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation.
`;

export const getHcfLcmPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return HCF_LCM_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
