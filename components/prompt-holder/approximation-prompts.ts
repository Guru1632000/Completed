/**
 * Generates a prompt for Approximation questions with detailed difficulty scaling.
 * Approximation questions test the ability to round numbers and perform quick arithmetic to find the closest answer.
 * The question text itself is the mathematical expression to be solved, ending with " = ?".
 */
const APPROXIMATION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Approximation questions. Each question MUST be logically independent. The goal is to find the approximate value, not the exact one.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. The options should be whole numbers, and one should be the closest to the approximated result. Distractors should be plausible.
- **Explanation:** The explanation MUST first show how each number is rounded (approximated) and then show the simplified calculation step-by-step.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use simple expressions with 2-3 terms involving addition, subtraction, multiplication, and basic percentages (e.g., 19.9%, 59.8%).
    -   Numbers should be easy to round (e.g., 19.9 -> 20, 5.1 -> 5).
    -   Example: "19.9 + 29.8 + 49.6 = ?" or "59.9% of 200 = ?"
-   **For 'Medium' difficulty:**
    -   Combine 3-4 operations, including division, squares (e.g., 8.2²), and common square roots (e.g., √1225).
    -   Use percentages of larger or less round numbers.
    -   Example: "(149.8 ÷ 5.1) + (39.9 × 2.1) = ?" or "(39.8% of 450) + (120 ÷ 4.9) = ?"
-   **For 'Hard' difficulty:**
    -   Use complex, multi-step expressions involving combinations of squares, cubes, roots, percentages, and division.
    -   Numbers might be slightly trickier to round or involve larger values.
    -   Example: "(√2916 ÷ 12.1) + (89.9 × 1.9) = ?" or "(29.8% of 1499) ÷ (5.1) = ?"
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy and Medium patterns.

**Example Questions to Model After:**

--- EASY ---
Q1. 19.9 + 29.8 + 49.6 = ? -> Approx: 20 + 30 + 50 = 100
Q2. 59.9% of 200 = ? -> Approx: 60% of 200 = 120
Q3. (4.9 × 6.1) + 24.8 = ? -> Approx: (5×6) + 25 = 55
Q4. 33.3% of 300 + 29.8% of 200 = ? -> Approx: (1/3 of 300) + (30% of 200) = 100 + 60 = 160

--- MODERATE ---
Q5. (149.8 ÷ 5.1) + (39.9 × 2.1) = ? -> Approx: (150 ÷ 5) + (40 × 2) = 30 + 80 = 110
Q6. (39.8% of 450) + (120 ÷ 4.9) = ? -> Approx: (40% of 450) + (120 ÷ 5) = 180 + 24 = 204 ≈ 200
Q7. (√1225 + 14.9 × 4.1) = ? -> Approx: 35 + (15 × 4) = 35 + 60 = 95
Q8. ³√1331 + 49.8 ÷ 4.9 = ? -> Approx: 11 + (50 ÷ 5) = 11 + 10 = 21

--- HARD ---
Q9. (199.8 ÷ 4.9) + (14.9²) = ? -> Approx: (200 ÷ 5) + 15² = 40 + 225 = 265
Q10. (√2916 ÷ 12.1) + (89.9 × 1.9) = ? -> Approx: (54 ÷ 12) + (90 × 2) = 4.5 + 180 ≈ 185
Q11. (29.8% of 1499) ÷ (5.1) = ? -> Approx: (30% of 1500) ÷ 5 = 450 ÷ 5 = 90
Q12. (³√3375 + 29.8² ÷ 10) = ? -> Approx: 15 + (30² ÷ 10) = 15 + (900 ÷ 10) = 15 + 90 = 105

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the approximation (rounding) step first, followed by the simplified calculation.
`;

export const getApproximationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return APPROXIMATION_PROMPT_TEMPLATE
        .replace(/\$\{numberOfQuestions\}/g, String(numberOfQuestions))
        .replace(/\$\{syllabusContextPrompt\}/g, syllabusContextPrompt)
        .replace(/\$\{difficultyInstruction\}/g, difficultyInstruction)
        .replace(/\$\{optionsCount\}/g, String(optionsCount));
};
