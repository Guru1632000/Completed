/**
 * Generates a prompt for Simplification questions with detailed difficulty scaling and question types.
 * Simplification questions test the ability to quickly perform arithmetic operations using BODMAS, approximations, squares/cubes, fractions, and percentages.
 * Note: Each simplification question is logically independent and does not share a context.
 */
const SIMPLIFICATION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Simplification questions. Each question MUST be logically independent. The question text itself is the mathematical expression to be solved, ending with " = ?".

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors (e.g., ignoring BODMAS).

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on basic BODMAS rules with 2-3 operations.
    -   Use simple integers.
    -   Example: "24 × 3 – 18 ÷ 3 = ?" or "(18 + 12) × 2 = ?"
-   **For 'Medium' difficulty:**
    -   Introduce percentages, fractions, squares, and square roots.
    -   Combine 3-4 operations.
    -   Example: "(15% of 200) + (25% of 80) = ?" or "(12² – 8²) = ?" or "(⅔ of 90) + (¼ of 40) = ?"
-   **For 'Hard' difficulty:**
    -   Use complex combinations of percentages, fractions, squares/cubes, and roots.
    -   Involve multiple brackets and 4-5 operations.
    -   May require approximation for some complex calculations if specified.
    -   Example: "[(4² + 6²) × 3] ÷ (√121) = ?" or "(48% of 750) ÷ 3 = ?"
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy and Medium patterns.

**Example Questions to Model After:**

--- EASY ---
Q1. 25 × 4 ÷ 10 = ? -> Ans: 10
Q2. 60 ÷ 5 + 8 × 2 = ? -> Ans: 28
Q3. 18 × 2 – 24 ÷ 6 = ? -> Ans: 32

--- MODERATE ---
Q4. 15% of 200 + 25% of 80 = ? -> Ans: 50
Q5. (240 ÷ 8) × (15 ÷ 5) = ? -> Ans: 90
Q6. √144 + √49 + √81 = ? -> Ans: 28
Q7. (450 ÷ 15) + (8 × 6) – (120 ÷ 10) = ? -> Ans: 66

--- HARD ---
Q8. (⅖ of 250) + (⅓ of 180) = ? -> Ans: 160
Q9. [(25% of 640) ÷ 8] + (√169) = ? -> Ans: 33
Q10. [(7² × 3) – (6³ ÷ 9)] = ? -> Ans: 123
Q11. (48% of 750) ÷ 3 = ? -> Ans: 120

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation following the BODMAS rule.
`;

export const getSimplificationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return SIMPLIFICATION_PROMPT_TEMPLATE
        .replace(/\$\{numberOfQuestions\}/g, String(numberOfQuestions))
        .replace(/\$\{syllabusContextPrompt\}/g, syllabusContextPrompt)
        .replace(/\$\{difficultyInstruction\}/g, difficultyInstruction)
        .replace(/\$\{optionsCount\}/g, String(optionsCount));
};
