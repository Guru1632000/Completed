/**
 * Generates a prompt for Percentage questions, covering a wide variety of applications.
 * Note: Each question is logically independent.
 */
const PERCENTAGE_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Percentage questions. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a mix of:
1.  **Basic Calculation:** "x is what % of y", "what is x% of y".
2.  **Percentage Change:** Increase/decrease, successive percentage changes.
3.  **Population/Depreciation:** Problems involving population growth or value depreciation over time.
4.  **Income, Expenditure & Savings:** Questions based on how a person spends their income.
5.  **Election/Voting Problems:** Scenarios with valid/invalid votes and candidates' shares.
6.  **Marks/Examination Problems:** Pass/fail percentages and finding total marks.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Focus on Basic Calculation and simple Percentage Change.
-   **For 'Moderate' difficulty:** Involve successive changes, simple population problems, and income/expenditure scenarios.
-   **For 'Hard' difficulty:** Focus on complex election problems, examination problems with multiple subjects/conditions, or multi-step income scenarios.
-   **For 'Mixed' difficulty:** Generate a balanced mix of all types.

**Example Questions to Model After:**

Q1. If A's salary is 25% more than B's salary, then by what percentage is B's salary less than A's salary? (Ans: 20%)
Q2. The population of a town increased from 1,75,000 to 2,62,500 in a decade. What is the average percent increase of population per year? (Ans: 5%)
Q3. In an election between two candidates, one got 55% of the total valid votes, and 20% of the votes were invalid. If the total number of votes was 7500, what is the number of valid votes that the other candidate got? (Ans: 2700)
Q4. A student has to secure 35% marks to pass. He got 80 marks and failed by 60 marks. Find the maximum marks. (Ans: 400)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation.
`;

export const getPercentagePrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return PERCENTAGE_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
