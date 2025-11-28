/**
 * Generates a prompt for Quadratic Equation questions, specifically for comparing the roots (x vs y).
 * This is a common format in Bank exams.
 * Note: Each question is logically independent and does not share a context.
 */
const QUADRATIC_EQUATION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quadratic Equation questions. Each question MUST be logically independent and follow the "comparison of roots" format.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Format:** Each \`questionText\` must contain two equations to solve: one for 'x' and one for 'y'. Use "I." for the x-equation and "II." for the y-equation.
- **Options:** All questions must have exactly \${optionsCount} options, using the following standard format:
    - A: x > y
    - B: x < y
    - C: x ≥ y
    - D: x ≤ y
    - E: x = y or the relationship cannot be established

**Difficulty-Based Equation Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use simple quadratic equations where roots are integers (e.g., x² - 5x + 6 = 0).
    -   The relationship between x and y should be straightforward (e.g., both roots of x are greater than both roots of y).
-   **For 'Medium' difficulty:**
    -   Introduce equations where roots might be fractions or where one equation is linear.
    -   The relationship might be more complex (e.g., one root of x is between the two roots of y).
-   **For 'Hard' difficulty:**
    -   Use equations with larger coefficients or those that result in square root values.
    -   Include equations where the 'relationship cannot be established' is the correct answer.
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy and Medium patterns.

**Example Questions to Model After:**

Q1. I. x² - 7x + 12 = 0, II. y² - 9y + 20 = 0. (Ans: B, x < y)
Q2. I. x² - x - 12 = 0, II. y² + 5y + 6 = 0. (Ans: E, relationship cannot be established)
Q3. I. x² = 81, II. y = √81. (Ans: D, x ≤ y)
Q4. I. 2x² - 13x + 21 = 0, II. y² - 8y + 15 = 0. (Ans: D, x ≤ y)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step process of solving both equations to find the roots of x and y, and then comparing them to establish the final relationship.
`;

export const getQuadraticEquationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return QUADRATIC_EQUATION_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
