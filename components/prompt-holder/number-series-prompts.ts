/**
 * Generates a prompt for Number Series questions with detailed difficulty scaling and question types.
 * Note: Each number series question is logically independent and does not share a context.
 */
const NUMBER_SERIES_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Number Series questions. Each question MUST be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options.

**Question Types (CRITICAL):**
-   If the syllabus context or topic name includes "Wrong Number Series" or "Find the Odd One Out", you **MUST** generate questions where the user has to find the incorrect number in the given series.
    -   The \`questionText\` for these should be the series itself (e.g., "3, 9, 27, 81, 244, 729").
    -   The \`options\` should be numbers from the series.
    -   The \`correctOption\` is the key corresponding to the wrong number.
    -   The \`explanation\` must state the correct pattern, identify the wrong number, and state what the correct number should have been.
-   Otherwise, generate standard "Find the next number" questions.
    -   The \`questionText\` should be the series with a "?" at the end (e.g., "2, 5, 8, 11, 14, ?").
    -   The \`options\` should be potential next numbers.
    -   The \`explanation\` must clearly state the pattern used to find the next number.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Simple arithmetic progressions (+, -), simple geometric progressions (x, /), or simple squares/cubes (n², n³).
-   **For 'Medium' difficulty:** Two-stage difference (difference of differences is constant), mixed series (e.g., n² + 1, n³ - n), or alternating series (two different patterns alternating).
-   **For 'Hard' difficulty:** Three-stage differences, complex mixed patterns (e.g., x2 + 1, x3 + 2), or series based on prime numbers.
-   **For 'Mixed' difficulty:** Generate a balanced mix of Easy and Medium patterns.

**Example Questions to Model After:**

--- FIND THE NEXT NUMBER ---
Q1. 2, 5, 8, 11, 14, ? (Pattern: +3) -> Answer: 17
Q2. 3, 6, 12, 24, 48, ? (Pattern: ×2) -> Answer: 96
Q3. 100, 95, 90, 85, 80, ? (Pattern: –5) -> Answer: 75
Q4. 4, 9, 16, 25, 36, ? (Pattern: Squares (2², 3², 4², 5², 6², …)) -> Answer: 49
Q5. 2, 6, 12, 20, 30, ? (Pattern: Add +4, +6, +8, +10 …) -> Answer: 42
Q6. 1, 2, 6, 24, 120, ? (Pattern: Factorial type (×1, ×2, ×3, ×4, ×5)) -> Answer: 720
Q7. 1, 8, 27, 64, 125, ? (Pattern: Cubes (1³, 2³, 3³, 4³, 5³, …)) -> Answer: 216
Q8. 2, 5, 10, 17, 26, ? (Pattern: n² + 1 or +3, +5, +7, +9...) -> Answer: 37
Q9. 11, 13, 17, 19, 23, 29, ? (Pattern: Prime numbers) -> Answer: 31
Q10. 3, 5, 9, 17, 33, ? (Pattern: Difference doubles: +2, +4, +8, +16...) -> Answer: 65

--- WRONG NUMBER SERIES ---
Q11. Find the wrong number: 3, 9, 27, 81, 243, 729, 1458 (Pattern: ×3. Wrong: 1458, should be 2187)
Q12. Find the wrong number: 5, 10, 20, 35, 70, 140 (Pattern: ×2. Wrong: 35, should be 40)
Q13. Find the wrong number: 2, 6, 18, 54, 162, 486, 972 (Pattern: ×3. Wrong: 972, should be 1458)
Q14. Find the wrong number: 512, 255, 127, 63, 31, 15, 7 (Pattern: (x*2)+1 from right. Wrong is 512, should be 511)
Q15. Find the wrong number: 404, 388, 366, 332, 292, 244, 188 (Pattern: Difference of differences is -8. Wrong is 366, should be 364)
Q16. Find the wrong number: 3, 4, 9, 28, 113, 566, 3396 (Pattern: x1+1, x2+1, x3+1... Wrong is 3396, should be 3397)
Q17. Find the wrong number: 0.5, 3.5, 21, 105, 420, 1260, 2500 (Pattern: x7, x6, x5, x4, x3, x2. Wrong is 2500, should be 2520)
Q18. Find the wrong number: 125, 343, 81, 1331, 169, 3375, 289 (Pattern: Alternating cubes and squares. Wrong is 81, should be 729 (9^3))

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON.
`;

export const getNumberSeriesPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return NUMBER_SERIES_PROMPT_TEMPLATE
        .replace(/\$\{numberOfQuestions\}/g, String(numberOfQuestions))
        .replace(/\$\{syllabusContextPrompt\}/g, syllabusContextPrompt)
        .replace(/\$\{difficultyInstruction\}/g, difficultyInstruction)
        .replace(/\$\{optionsCount\}/g, String(optionsCount));
};
