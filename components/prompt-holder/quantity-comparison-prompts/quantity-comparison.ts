/**
 * Generates a prompt for Quantity Comparison (Quantity I vs Quantity II) questions.
 */
const QUANTITY_COMPARISON_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantity Comparison questions. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Format:** The \`questionText\` field **MUST** contain a main context/question, followed by "Quantity I:" and "Quantity II:".
- **Options:** All questions must have exactly \${optionsCount} options, using the following standard text:
    - A: Quantity I > Quantity II
    - B: Quantity I < Quantity II
    - C: Quantity I ≥ Quantity II
    - D: Quantity I ≤ Quantity II
    - E: Quantity I = Quantity II or the relationship cannot be established.

**Difficulty-Based Question Generation Rules:**
-   **For 'Easy'/'Medium' difficulty:** Use questions where quantities are based on Arithmetic topics like Percentage, Profit & Loss, or Simple Equations.
-   **For 'Hard' difficulty:** Use questions where quantities are based on Mensuration, Probability, or require solving complex equations.

**Example Question to Model After:**

A rectangular garden has a length of 12m and a breadth of 5m.
Quantity I: The perimeter of the garden.
Quantity II: The area of the garden.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. The explanation for each question must be very clear:
1.  Calculate the value of Quantity I.
2.  Calculate the value of Quantity II.
3.  Compare the two values to determine the relationship.
4.  Conclude which option (A, B, C, D, or E) is correct.
`;

export const getQuantityComparisonPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return QUANTITY_COMPARISON_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
